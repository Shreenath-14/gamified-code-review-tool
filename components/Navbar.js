import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">Gamified Code Review Tool</h1>
      <div className="flex gap-4 items-center">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/challenges">Challenges</Link>
        <Link href="/leaderboard">Leaderboard</Link>

        {session ? (
          <button
            onClick={() => signOut()}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  )
}
