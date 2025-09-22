import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"

export default function Login() {
  const { data: session } = useSession()
  const router = useRouter()

  if (session) {
    // if already logged in → go dashboard
    router.replace("/dashboard")
    return <p className="p-6">Redirecting to dashboard...</p>
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        <button
          onClick={() => signIn("google")}
          className="w-full mb-3 bg-red-500 text-white py-2 rounded-lg"
        >
          Login with Google
        </button>

        <button
          onClick={() => signIn("github")}
          className="w-full bg-gray-700 text-white py-2 rounded-lg"
        >
          Login with GitHub
        </button>
      </div>
    </div>
  )
}
