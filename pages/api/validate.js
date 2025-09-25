// pages/api/validate.js
import vm from "vm"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { createClient } from "@supabase/supabase-js"
import { updateScore } from "../../lib/db" // your leaderboard updater (lowdb or similar)

/**
 * NOTE:
 * - Ensure env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * - The client should POST JSON: { code: "<user code>", challengeId: "<uuid>" }
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

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

  // auth: require logged-in user
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ success: false, message: "Not authenticated" })
  }
  const userId = session.user.email || session.user.name || session.user.id || "Guest"

  const { code, challengeId } = req.body
  if (!code || !challengeId) {
    return res.status(400).json({ success: false, message: "Missing code or challengeId" })
  }

  // fetch challenge (server-side, authoritative)
  const { data: challenge, error: supError } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", challengeId)
    .single()

  if (supError || !challenge) {
    return res.status(404).json({ success: false, message: "Challenge not found" })
  }

  // test cases could be in test_cases or testCases
  const tests = challenge.test_cases || challenge.testCases || []

  if (!Array.isArray(tests) || tests.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No test cases defined for this challenge" })
  }

  // Run user code in sandbox
  // Strategy:
  // 1) create a VM context and run user's code there
  // 2) look for a callable function in the context: prefer (in order) challenge.function_name, 'solution', 'main', 'solve'
  // 3) execute that function for each test using a short timeout
  const sandbox = {}
  vm.createContext(sandbox)

  // helper: safe execution wrapper
  try {
    // run user's code + define a pointer __user_fn by checking common names
    const functionNamesToTry = [
      challenge.function_name,
      "solution",
      "main",
      "solve",
      "handler",
      "run",
      "fn",
    ].filter(Boolean) // drop falsy

    // Build script that sets __user_fn if any of the names exist after running user code
    const detectionCode = `
      ${code}
      // find the first defined function in the list
      __user_fn = null;
      (function(){
        const names = ${JSON.stringify(functionNamesToTry)};
        for (let n of names) {
          try {
            if (typeof globalThis[n] === "function") { __user_fn = globalThis[n]; break; }
            if (typeof this[n] === "function") { __user_fn = this[n]; break; }
          } catch(e) {}
        }
      })();
    `

    // run user code + detection
    const script = new vm.Script(detectionCode)
    script.runInContext(sandbox, { timeout: 1000 }) // 1s to init user's code

    const userFn = sandbox.__user_fn
    if (!userFn || typeof userFn !== "function") {
      return res.status(400).json({
        success: false,
        message:
          "Couldn't find a function to run. Make sure you define a function named one of: " +
          functionNamesToTry.join(", "),
      })
    }

    // run tests
    for (const t of tests) {
      // ensure inputs are an array (if test.input is single value, wrap)
      const args = Array.isArray(t.input) ? t.input : [t.input]

      // call function inside VM context with timeout by creating a small script that calls it
      // we serialize args into the VM run invocation (safe enough for MVP)
      const callCode = `__user_fn.apply(null, ${JSON.stringify(args)})`
      let output
      try {
        output = vm.runInContext(callCode, sandbox, { timeout: 1000 })
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: `Runtime error while running test input ${JSON.stringify(args)}: ${err.message}`,
        })
      }

      const expected = t.output !== undefined ? t.output : t.expected
      if (!deepEqual(output, expected)) {
        return res.status(200).json({
          success: false,
          message: `Failed on input ${JSON.stringify(args)}. Expected ${JSON.stringify(
            expected
          )} but got ${JSON.stringify(output)}`,
        })
      }
    }

    // all tests passed -> award points
    try {
      await updateScore(userId, challenge.points || 0, challenge.id)
    } catch (err) {
      // don't fail the whole response if leaderboard update breaks — still report success for tests
      console.error("Failed to update score:", err)
    }

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
