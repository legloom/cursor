interface AIEngineTabProps {
  storeId: string
}

export default function AIEngineTab({ storeId }: AIEngineTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">AI Engine</h2>
      <div className="card-premium p-8 text-center">
        <p className="text-gray-600">AI engine configuration coming soon...</p>
        <p className="text-sm text-gray-500 mt-2">Will include threshold tuning, rule weights, and email cadence settings</p>
      </div>
    </div>
  )
}