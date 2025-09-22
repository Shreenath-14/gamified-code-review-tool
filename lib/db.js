import { Low } from "lowdb"
import { JSONFile } from "lowdb/node"
import path from "path"

// file path for JSON db
const file = path.join(process.cwd(), "db.json")
const adapter = new JSONFile(file)
const db = new Low(adapter, { leaderboard: [] })

// initialize
await db.read()
db.data ||= { leaderboard: [] }
await db.write()

export async function getLeaderboard() {
  await db.read()
  return db.data.leaderboard.sort((a, b) => b.score - a.score)
}

export async function updateScore(name, points, challengeId) {
  await db.read()
  let player = db.data.leaderboard.find((p) => p.name === name)

  if (player) {
    if (!player.solved) player.solved = [] // ✅ ensure array exists
    if (!player.solved.includes(challengeId)) {
      player.score += points
      player.solved.push(challengeId)
    }
  } else {
    db.data.leaderboard.push({ name, score: points, solved: [challengeId] })
  }

  await db.write()
}
