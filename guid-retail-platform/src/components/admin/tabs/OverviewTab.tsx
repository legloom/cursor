'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDelta } from '@/lib/utils'

interface KPIData {
  totalSearches: { value: number; delta: number }
  successRate: { value: number; delta: number }
  missingProducts: { value: number; delta: number }
  dailyAverage: { value: number; delta: number }
}

interface MissingProduct {
  term: string
  count: number
}

interface OverviewData {
  overview: KPIData
  topMissingProducts: MissingProduct[]
  period: {
    start: string
    end: string
    days: number
  }
}

interface OverviewTabProps {
  storeId: string
}

export default function OverviewTab({ storeId }: OverviewTabProps) {
  const [data, setData] = useState<OverviewData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState('30d')

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/analytics/overview?storeId=${storeId}&period=${period}`)
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setData(result)
          }
        }
      } catch (error) {
        console.error('Failed to fetch overview data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOverviewData()
  }, [storeId, period])

  const KPICard = ({ 
    title, 
    value, 
    delta, 
    icon: Icon, 
    format = 'number',
    iconColor = 'text-blue-600',
    iconBg = 'bg-blue-100'
  }: {
    title: string
    value: number
    delta: number
    icon: React.ElementType
    format?: 'number' | 'percentage'
    iconColor?: string
    iconBg?: string
  }) => {
    const deltaFormatted = formatDelta(delta)
    
    return (
      <div className="kpi-card">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div className="flex items-center space-x-1">
            {delta > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : delta < 0 ? (
              <TrendingDown className="w-4 h-4 text-red-600" />
            ) : null}
            <span className={`text-sm font-medium ${deltaFormatted.className}`}>
              {deltaFormatted.text}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="kpi-value">
            {format === 'percentage' ? `${value}%` : value.toLocaleString()}
          </div>
          <div className="kpi-label">{title}</div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
          <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="kpi-card">
              <div className="w-full h-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Failed to load overview data</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { value: '7d', label: '7 Days' },
            { value: '30d', label: '30 Days' },
            { value: '90d', label: '90 Days' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setPeriod(option.value)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                period === option.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Searches"
          value={data.overview.totalSearches.value}
          delta={data.overview.totalSearches.delta}
          icon={Search}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />
        <KPICard
          title="Success Rate"
          value={data.overview.successRate.value}
          delta={data.overview.successRate.delta}
          icon={CheckCircle}
          format="percentage"
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
        <KPICard
          title="Missing Products"
          value={data.overview.missingProducts.value}
          delta={data.overview.missingProducts.delta}
          icon={AlertCircle}
          iconColor="text-red-600"
          iconBg="bg-red-100"
        />
        <KPICard
          title="Daily Average"
          value={data.overview.dailyAverage.value}
          delta={data.overview.dailyAverage.delta}
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
      </div>

      {/* Missing Products Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Requested Missing Products */}
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Most Requested Missing Products
            </h3>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add to Inventory
            </Button>
          </div>
          
          {data.topMissingProducts.length > 0 ? (
            <div className="space-y-4">
              {data.topMissingProducts.slice(0, 5).map((product, index) => (
                <div key={product.term} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">{product.term}</span>
                  </div>
                  <span className="text-sm text-gray-600">{product.count} requests</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No missing product requests found</p>
            </div>
          )}
        </div>

        {/* Search Trends Chart Placeholder */}
        <div className="card-premium p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Search Trends</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Chart visualization would go here</p>
              <p className="text-sm">(Recharts integration)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Period Info */}
      <div className="text-sm text-gray-500 text-center">
        Showing data from {new Date(data.period.start).toLocaleDateString()} to{' '}
        {new Date(data.period.end).toLocaleDateString()} ({data.period.days} days)
      </div>
    </div>
  )
}