// pages/api/user/[email].js
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  const { email } = req.query

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  if (!email) {
    return res.status(400).json({ error: "Missing email" })
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    if (error) throw error

    if (!data) {
      return res.status(200).json({
        email,
        score: 0,
        solved: [],
      })
    }

    return res.status(200).json({
      email: data.email,
      score: data.score || 0,
      solved: data.solved || [],
    })
  } catch (err) {
    console.error("Error fetching user:", err)
    return res.status(500).json({ error: "Failed to fetch user" })
  }
}
