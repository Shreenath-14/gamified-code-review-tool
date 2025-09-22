export default function StatCard({ title, value, subtitle, icon = '🔥' }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 w-full">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-bold mt-1">{value}</div>
          {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  )
}
