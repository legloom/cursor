interface RealTimeTabProps {
  storeId: string
}

export default function RealTimeTab({ storeId }: RealTimeTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Real-Time Data</h2>
      <div className="card-premium p-8 text-center">
        <p className="text-gray-600">Real-time search monitoring coming soon...</p>
        <p className="text-sm text-gray-500 mt-2">Will include live search feed, sparklines, and category heatmaps</p>
      </div>
    </div>
  )
}