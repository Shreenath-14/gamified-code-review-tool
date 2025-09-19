import Navbar from "../components/Navbar"

export default function Leaderboard() {
  const fakeData = [
    { name: "Shree", score: 120 },
    { name: "Alex", score: 95 },
    { name: "Sam", score: 80 },
  ]

  return (
    <>
      <Navbar />
      <div className="text-center mt-20 px-4">
        <h1 className="text-3xl font-bold mb-6">Leaderboard 🏆</h1>
        <div className="mx-auto max-w-xl">
          <table className="w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-2 text-left">Player</th>
                <th className="px-6 py-2 text-left">Score</th>
              </tr>
            </thead>
            <tbody>
              {fakeData.map((row, i) => (
                <tr key={i} className="border-t">
                  <td className="px-6 py-3">{row.name}</td>
                  <td className="px-6 py-3">{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
