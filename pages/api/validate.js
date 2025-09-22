import { updateScore } from "../../lib/db"
import { challenges } from "../../lib/challenges"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" })
  }

  const { code, challengeId, user } = req.body
  const challenge = challenges.find((c) => c.id === Number(challengeId))

  if (!challenge) {
    return res.status(404).json({ error: "Challenge not found" })
  }

  try {
    // eslint-disable-next-line no-eval
    const userFunc = eval(`(${code})`)

    let passed = 0
    for (const t of challenge.tests) {
      const output = userFunc(...t.input)
      if (output === t.expected) {
        passed++
      }
    }

    if (passed === challenge.tests.length) {
      await updateScore(user || "Guest", challenge.points, challenge.id)
      return res.status(200).json({
        success: true,
        message: `All test cases passed! 🎉 +${challenge.points} XP`,
        score: challenge.points,
      })
    } else {
      return res.status(200).json({
        success: false,
        message: `${passed}/${challenge.tests.length} test cases passed.`,
      })
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Error running code: " + err.message,
    })
  }
}
