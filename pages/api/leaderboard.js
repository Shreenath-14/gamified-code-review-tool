import { getLeaderboard } from "../../lib/db"

export default async function handler(req, res) {
  const leaderboard = await getLeaderboard()
  res.status(200).json(leaderboard)
}
