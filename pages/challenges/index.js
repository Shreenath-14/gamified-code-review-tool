import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { challenges } from "../../lib/challenges"
import ChallengeCard from "../../components/ChallengeCards"

export default function ChallengesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login")
    }
  }, [status, router])

  if (status === "loading") return <p className="p-6">Loading...</p>
  if (!session) return null

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Challenges</h1>
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
    </main>
  )
}
