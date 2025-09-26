import StatCard from "../components/StatCard"
import ChallengeCard from "../components/ChallengeCards"
import BadgePill from "../components/BadgePill"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [xp, setXp] = useState(0)
  const [rank, setRank] = useState("#-")
  const [solved, setSolved] = useState(0)
  const [challenges, setChallenges] = useState([])

  // Protect route
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return <p className="p-6">Loading...</p>
  }

  if (!session) {
    return null
  }

  // Fetch user stats directly from Supabase API
  useEffect(() => {
    async function fetchUserStats() {
      if (!session?.user?.email) return

      try {
        const res = await fetch(`/api/user/${session.user.email}`)
        if (!res.ok) throw new Error("Failed to fetch user stats")
        const data = await res.json()

        setXp(data.score || 0)
        setSolved((data.solved || []).length || 0)

        // rank could still be from leaderboard if you want
        const leaderboardRes = await fetch("/api/leaderboard")
        if (leaderboardRes.ok) {
          const lbData = await leaderboardRes.json()
          const sorted = [...lbData].sort((a, b) => b.score - a.score)
          const index = sorted.findIndex((p) => p.email === session.user.email)
          if (index !== -1) setRank(`#${index + 1}`)
        }
      } catch (err) {
        console.error("Error fetching user stats:", err)
      }
    }

    fetchUserStats()
  }, [session])


  // Fetch challenges from Supabase via API
  useEffect(() => {
    async function fetchChallenges() {
      try {
        const res = await fetch("/api/challenges")
        if (!res.ok) throw new Error("Failed to fetch challenges")
        const data = await res.json()
        setChallenges(data.slice(0, 6)) // show only top 6 popular challenges
      } catch (err) {
        console.error("Error fetching challenges:", err)
      }
    }
    fetchChallenges()
  }, [])

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
          {challenges.length === 0 ? (
            <p>No challenges available. Add some in Supabase.</p>
          ) : (
            challenges.map((c) => (
              <ChallengeCard
                key={c.id}
                title={c.title}
                difficulty={c.difficulty}
                points={c.points}
                onOpen={() => router.push(`/challenges/${c.id}`)}
              />
            ))
          )}
        </div>
      </section>
    </main>
  )
}
