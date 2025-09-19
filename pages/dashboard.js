import { useSession } from "next-auth/react"
import Navbar from "../components/Navbar"

export default function Dashboard() {
  const { data: session } = useSession()

  return (
    <>
      <Navbar />
      <div className="text-center mt-20 px-4">
        <h1 className="text-3xl font-bold">
          Welcome {session?.user?.name || "Shree"} 👋
        </h1>
        <p className="text-gray-600 mt-2">Choose what you want to do today:</p>

        <div className="mt-8 flex gap-6 justify-center">
          <a href="/challenges" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
            🚀 Start a Code Challenge
          </a>
          <a href="/leaderboard" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
            🏆 View Leaderboard
          </a>
        </div>
      </div>
    </>
  )
}
