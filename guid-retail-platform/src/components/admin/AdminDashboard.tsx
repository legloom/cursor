'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Search, 
  Upload, 
  Activity, 
  Brain, 
  Settings, 
  Store,
  TrendingUp,
  Users,
  Package,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import OverviewTab from './tabs/OverviewTab'
import SearchAnalyticsTab from './tabs/SearchAnalyticsTab'
import InventoryUploadTab from './tabs/InventoryUploadTab'
import RealTimeTab from './tabs/RealTimeTab'
import RecommendationsTab from './tabs/RecommendationsTab'
import AIEngineTab from './tabs/AIEngineTab'
import SettingsTab from './tabs/SettingsTab'

interface DemoStore {
  id: string
  name: string
  locale: string
  kiosks: Array<{
    id: string
    name: string
  }>
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'analytics', label: 'Search Analytics', icon: Search },
  { id: 'inventory', label: 'Inventory Upload', icon: Upload },
  { id: 'realtime', label: 'Real-Time Data', icon: Activity },
  { id: 'recommendations', label: 'AI Recommendations', icon: Brain },
  { id: 'ai-engine', label: 'AI Engine', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [demoStore, setDemoStore] = useState<DemoStore | null>(null)
  const [isLoadingStore, setIsLoadingStore] = useState(true)

  // Fetch demo store on component mount
  useEffect(() => {
    const fetchDemoStore = async () => {
      try {
        const response = await fetch('/api/demo/store')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setDemoStore(data.store)
          }
        }
      } catch (error) {
        console.error('Failed to fetch demo store:', error)
      } finally {
        setIsLoadingStore(false)
      }
    }

    fetchDemoStore()
  }, [])

  const renderTabContent = () => {
    if (!demoStore) return null

    switch (activeTab) {
      case 'overview':
        return <OverviewTab storeId={demoStore.id} />
      case 'analytics':
        return <SearchAnalyticsTab storeId={demoStore.id} />
      case 'inventory':
        return <InventoryUploadTab storeId={demoStore.id} />
      case 'realtime':
        return <RealTimeTab storeId={demoStore.id} />
      case 'recommendations':
        return <RecommendationsTab storeId={demoStore.id} />
      case 'ai-engine':
        return <AIEngineTab storeId={demoStore.id} />
      case 'settings':
        return <SettingsTab store={demoStore} />
      default:
        return <OverviewTab storeId={demoStore.id} />
    }
  }

  if (isLoadingStore) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!demoStore) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load store data. Please refresh the page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Guid Admin</h1>
            </div>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Store className="w-4 h-4" />
              <span>{demoStore.name}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Manager View
            </Button>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">A</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {renderTabContent()}
      </main>
    </div>
  )
}