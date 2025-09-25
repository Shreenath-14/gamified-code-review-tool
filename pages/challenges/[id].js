import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Editor from "@monaco-editor/react"

export default function ChallengeDetail() {
  const router = useRouter()
  const { id } = router.query
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [code, setCode] = useState("// Write your solution here\nfunction solution() {\n  // your code\n}")
  const [result, setResult] = useState(null)

  // Fetch challenge details
  useEffect(() => {
    if (!id) return

    async function fetchChallenge() {
      try {
        const res = await fetch(`/api/challenges/${id}`)
        if (!res.ok) throw new Error("Failed to fetch challenge")
        const data = await res.json()
        setChallenge(data)
      } catch (err) {
        setError("Could not load challenge.")
      } finally {
        setLoading(false)
      }
    }

    fetchChallenge()
  }, [id])

  // Submit code for validation
  async function handleSubmit() {
    if (!challenge) return

    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          challengeId: challenge.id, // ✅ send only the id
        }),
      })

      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ success: false, message: "Error validating code" })
    }
  }

  if (loading) return <p className="p-6">Loading challenge...</p>
  if (error) return <p className="p-6 text-red-500">{error}</p>
  if (!challenge) return null

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{challenge.title}</h1>
      <p className="text-gray-600 mb-2">
        {challenge.difficulty} – {challenge.points} pts
      </p>
      <p className="mb-6">{challenge.description}</p>

      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Code Editor</h2>
        <Editor
          height="300px"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
        />

        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>

      {result && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          {result.success ? (
            <p className="text-green-600">✅ {result.message || "All test cases passed!"}</p>
          ) : (
            <p className="text-red-600">❌ {result.message}</p>
          )}
        </div>
      )}
    </div>
  )
}
