// pages/api/leaderboard.js
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("email, score, solved")
      .order("score", { ascending: false })

    if (error) throw error

    const leaderboard = data.map((user) => ({
      name: user.email.split("@")[0], // show first part of email as username
      score: user.score || 0,
      solved: user.solved || [],
    }))

    res.status(200).json(leaderboard)
  } catch (err) {
    console.error("Leaderboard error:", err)
    res.status(500).json({ error: "Failed to load leaderboard" })
  }
}
