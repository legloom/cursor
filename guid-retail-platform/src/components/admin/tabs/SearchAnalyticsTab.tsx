interface SearchAnalyticsTabProps {
  storeId: string
}

export default function SearchAnalyticsTab({ storeId }: SearchAnalyticsTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Search Analytics</h2>
      <div className="card-premium p-8 text-center">
        <p className="text-gray-600">Search analytics dashboard coming soon...</p>
        <p className="text-sm text-gray-500 mt-2">Will include time trends, top queries, conversion metrics, and behavior flow</p>
      </div>
    </div>
  )
}