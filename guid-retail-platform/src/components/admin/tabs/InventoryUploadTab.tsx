interface InventoryUploadTabProps {
  storeId: string
}

export default function InventoryUploadTab({ storeId }: InventoryUploadTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Inventory Upload</h2>
      <div className="card-premium p-8 text-center">
        <p className="text-gray-600">CSV inventory upload functionality coming soon...</p>
        <p className="text-sm text-gray-500 mt-2">Will include drag-and-drop CSV upload, column mapping, and batch import</p>
      </div>
    </div>
  )
}