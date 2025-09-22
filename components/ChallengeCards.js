export default function ChallengeCard({ title, difficulty, points, onOpen }) {
  const colorClass =
    difficulty === 'Easy'
      ? 'bg-green-100 text-green-800'
      : difficulty === 'Medium'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-red-100 text-red-800'

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="mt-3">
          <span className={`px-2 py-1 rounded-full text-sm ${colorClass}`}>{difficulty}</span>
          <span className="ml-3 text-sm text-gray-500">{points} pts</span>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={onOpen}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Attempt
        </button>
      </div>
    </div>
  )
}
