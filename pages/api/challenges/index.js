import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("challenges").select("*")

    if (error) {
      console.error("Supabase error:", error.message)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data)
  }

  res.setHeader("Allow", ["GET"])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
