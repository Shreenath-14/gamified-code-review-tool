import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Link from "next/link"

export default function ChallengesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login")
    }
  }, [status, router])

  // fetch challenges
  useEffect(() => {
    if (status === "authenticated") {
      async function fetchChallenges() {
        try {
          setLoading(true)
          const res = await fetch("/api/challenges")
          if (!res.ok) throw new Error("Failed to fetch challenges")
          const data = await res.json()
          setChallenges(data)
        } catch (err) {
          console.error("Error fetching challenges:", err)
          setError("Could not load challenges. Please try again.")
        } finally {
          setLoading(false)
        }
      }
      fetchChallenges()
    }
  }, [status])

  if (status === "loading") return <p className="p-6">Loading...</p>
  if (!session) return null

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Challenges</h1>

      {loading && <p>Loading challenges...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && challenges.length === 0 && (
        <p>No challenges found. Please add some in Supabase.</p>
      )}

      <ul>
        {challenges.map((challenge) => (
          <li
            key={challenge.id}
            className="border p-4 mb-2 rounded shadow-sm hover:bg-gray-50"
          >
            <Link href={`/challenges/${challenge.id}`}>
              <div>
                <h2 className="font-semibold text-lg">{challenge.title}</h2>
                <p className="text-sm text-gray-600">
                  {challenge.difficulty} – {challenge.points} pts
                </p>
                <p className="mt-2 text-gray-700">{challenge.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
