// pages/api/validate.js
import vm from "vm"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { createClient } from "@supabase/supabase-js"

// ✅ setup supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// deep equality helper
function deepEqual(a, b) {
  try {
    return JSON.stringify(a) === JSON.stringify(b)
  } catch {
    return a === b
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" })
  }

  // ✅ require login
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ success: false, message: "Not authenticated" })
  }
  const userId = session.user.email || session.user.name || session.user.id || "Guest"

  const { code, challengeId } = req.body
  if (!code || !challengeId) {
    return res.status(400).json({ success: false, message: "Missing code or challengeId" })
  }

  // ✅ fetch challenge from Supabase
  const { data: challenge, error: supError } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", challengeId)
    .single()

  if (supError || !challenge) {
    return res.status(404).json({ success: false, message: "Challenge not found" })
  }

  const tests = challenge.test_cases || challenge.testCases || []
  if (!Array.isArray(tests) || tests.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No test cases defined for this challenge" })
  }

  // ✅ run user code safely
  const sandbox = { console }
  vm.createContext(sandbox)

  try {
    // function name detection
    const functionNamesToTry = [
      challenge.function_name,
      "solution",
      "main",
      "solve",
      "handler",
      "run",
      "fn",
    ].filter(Boolean)

    const detectionCode = `
      ${code}
      globalThis.__user_fn = null;
      const names = ${JSON.stringify(functionNamesToTry)};
      for (let n of names) {
        try {
          if (typeof globalThis[n] === "function") { globalThis.__user_fn = globalThis[n]; break; }
        } catch(e) {}
      }
    `

    // run user code + capture function
    const script = new vm.Script(detectionCode)
    script.runInContext(sandbox, { timeout: 1000 })

    const userFn = sandbox.__user_fn
    if (!userFn || typeof userFn !== "function") {
      return res.status(400).json({
        success: false,
        message:
          "Couldn't find a function to run. Please define: " +
          functionNamesToTry.join(", "),
      })
    }

    // ✅ run all test cases
    for (const t of tests) {
      const args = Array.isArray(t.input) ? t.input : [t.input]

      let output
      try {
        output = userFn(...args)
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: `Runtime error on input ${JSON.stringify(args)}: ${err.message}`,
        })
      }

      const expected = t.output !== undefined ? t.output : t.expected
      if (!deepEqual(output, expected)) {
        return res.status(200).json({
          success: false,
          message: `Failed on input ${JSON.stringify(args)}. Expected ${JSON.stringify(
            expected
          )}, got ${JSON.stringify(output)}`,
        })
      }
    }

    // ✅ update user stats in Supabase
    const { data: existing } = await supabase
      .from("users")
      .select("*")
      .eq("email", userId)
      .single()

    const newScore = (existing?.score || 0) + (challenge.points || 0)
    const newSolved = [...(existing?.solved || []), challenge.id]

    await supabase.from("users").upsert({
      email: userId,
      score: newScore,
      solved: newSolved,
    })

    return res.status(200).json({
      success: true,
      message: `All test cases passed! 🎉 +${challenge.points || 0} XP`,
      points: challenge.points || 0,
    })
  } catch (err) {
    console.error("Validation error:", err)
    return res.status(500).json({ success: false, message: "Internal validation error" })
  }
}
