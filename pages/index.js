import { useSession, signIn } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/router"

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  // If logged in, redirect to dashboard
  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Gamified Code Review Tool 🚀</h1>
      {!session && (
        <>
          <p>You are not signed in</p>
          <button onClick={() => signIn("credentials", { username: "shree", password: "1234" })}>
            Login as Shree
          </button>
          <h1 className="text-4xl font-bold text-red-500">
            If this is Red & Big → Tailwind works ✅
          </h1>

        </>
      )}
    </div>
  )
}
