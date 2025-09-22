import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

export default function LeaderboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [players, setPlayers] = useState([])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login")
    }
  }, [status, router])

  useEffect(() => {
    async function fetchLeaderboard() {
      const res = await fetch("/api/leaderboard")
      const data = await res.json()
      const sorted = [...data].sort((a, b) => b.score - a.score)
      setPlayers(sorted)
    }
    if (session) fetchLeaderboard()
  }, [session])

  if (status === "loading") return <p className="p-6">Loading...</p>
  if (!session) return null

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      <table className="w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Rank</th>
            <th className="p-2 text-left">Player</th>
            <th className="p-2 text-left">Points</th>
            <th className="p-2 text-left">Solved</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, idx) => (
            <tr key={p.name} className="border-t">
              <td className="p-2">#{idx + 1}</td>
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.score}</td>
              <td className="p-2">{(p.solved || []).length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
