import StatCard from "../components/StatCard"
import ChallengeCard from "../components/ChallengeCards"
import BadgePill from "../components/BadgePill"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { challenges } from "../lib/challenges"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [xp, setXp] = useState(0)
  const [rank, setRank] = useState("#-")
  const [solved, setSolved] = useState(0)

  // Protect route
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login")
    }
  }, [status, router])

  // Loading state
  if (status === "loading") {
    return <p className="p-6">Loading...</p>
  }

  if (!session) {
    return null // avoids flicker before redirect
  }

  // Fetch leaderboard + user data
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/leaderboard")
      const data = await res.json()
      const playerName = session?.user?.name || "Shree"

      // find current player
      const player = data.find((p) => p.name === playerName)
      if (player) {
        setXp(player.score)
        setSolved((player.solved || []).length) // safe fallback
      }

      // rank is just index + 1
      const sorted = [...data].sort((a, b) => b.score - a.score)
      const index = sorted.findIndex((p) => p.name === playerName)
      if (index !== -1) {
        setRank(`#${index + 1}`)
      }
    }

    if (session) {
      fetchData()
    }
  }, [session])

  return (
    <main className="max-w-6xl mx-auto p-6">
      <section className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {session?.user?.name || "Shree"}
          </h1>
          <p className="text-gray-500 mt-1">
            Keep the streak alive — try a challenge today.
          </p>
          <div className="mt-3 flex gap-2">
            <BadgePill label="Beginner" />
            <BadgePill label={`Streak: ${solved}`} />
          </div>
        </div>

        <div className="flex gap-4 mt-6 md:mt-0">
          <div className="w-40">
            <StatCard title="Points" value={xp} icon="⚡" />
          </div>
          <div className="w-40">
            <StatCard title="Solved" value={solved} icon="✅" />
          </div>
          <div className="w-40">
            <StatCard title="Rank" value={rank} icon="🏅" />
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Popular Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {challenges.map((c) => (
            <ChallengeCard
              key={c.id}
              title={c.title}
              difficulty={
                c.points === 20
                  ? "Easy"
                  : c.points === 40
                  ? "Medium"
                  : "Hard"
              }
              points={c.points}
              onOpen={() => router.push(`/challenges/${c.id}`)}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
