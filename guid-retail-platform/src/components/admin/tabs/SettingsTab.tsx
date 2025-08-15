interface DemoStore {
  id: string
  name: string
  locale: string
  kiosks: Array<{
    id: string
    name: string
  }>
}

interface SettingsTabProps {
  store: DemoStore
}

export default function SettingsTab({ store }: SettingsTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
      <div className="card-premium p-8 text-center">
        <p className="text-gray-600">Store and system settings coming soon...</p>
        <p className="text-sm text-gray-500 mt-2">Will include store management, team members, locales, and API keys</p>
        <div className="mt-4 text-left">
          <p className="text-sm text-gray-600">Current store: <span className="font-medium">{store.name}</span></p>
          <p className="text-sm text-gray-600">Kiosks: {store.kiosks.length} configured</p>
        </div>
      </div>
    </div>
  )
}