
import { useRouter } from "next/router"
import Editor from "@monaco-editor/react"
import { useState, useEffect } from "react"
import { challenges } from "../../lib/challenges"

export default function ChallengeDetail() {
  const router = useRouter()
  const { id } = router.query
  const [challenge, setChallenge] = useState(null)
  const [code, setCode] = useState("")

  useEffect(() => {
    if (id) {
      const ch = challenges.find((c) => c.id === Number(id))
      setChallenge(ch)
      if (ch) {
        setCode("// " + ch.description + "\n\nfunction solution() {\n  // your code here\n}")
      }
    }
  }, [id])

  const handleSubmit = async () => {
    const response = await fetch("/api/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: code,
        challengeId: id,
        user: "Shree"
      }),
    })

    const result = await response.json()
    alert(result.message)
  }

  if (!challenge) return <p>Loading...</p>

  return (
    <>
    
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold">{challenge.title}</h1>
        <p className="text-gray-600 mt-2">{challenge.description}</p>

        <div className="mt-6 border rounded-lg overflow-hidden shadow">
          <Editor
            height="400px"
            defaultLanguage="javascript"
            value={code}
            onChange={(value) => setCode(value)}
            theme="vs-dark"
          />
        </div>

        <div className="mt-4 text-right">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  )
}
