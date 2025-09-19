import Link from "next/link"
import { signOut } from "next-auth/react"

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="space-x-6">
        <Link href="/dashboard" className="text-white hover:text-yellow-300">Dashboard</Link>
        <Link href="/challenges" className="text-white hover:text-yellow-300">Challenges</Link>
        <Link href="/leaderboard" className="text-white hover:text-yellow-300">Leaderboard</Link>
      </div>
      <button
        onClick={() => signOut()}
        className="text-white hover:text-red-400"
      >
        Logout
      </button>
    </nav>
  )
}
