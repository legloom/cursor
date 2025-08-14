'use client'

import { useState, useEffect } from 'react'
import { 
  Brain, 
  Package, 
  RotateCcw, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  X,
  AlertCircle,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

interface Recommendation {
  id: string
  type: 'restock' | 'reposition' | 'promote'
  title: string
  description: string
  confidence: number
  status: 'open' | 'accepted' | 'snoozed' | 'dismissed'
  impact: string
  createdAt: string
  updatedAt: string
  payload: string // JSON string
}

interface RecommendationsTabProps {
  storeId: string
}

const typeConfig = {
  restock: {
    icon: Package,
    label: 'Restock',
    color: 'text-blue-600',
    bg: 'bg-blue-100',
  },
  reposition: {
    icon: RotateCcw,
    label: 'Reposition',
    color: 'text-purple-600',
    bg: 'bg-purple-100',
  },
  promote: {
    icon: TrendingUp,
    label: 'Promote',
    color: 'text-green-600',
    bg: 'bg-green-100',
  },
}

const statusConfig = {
  open: { label: 'Open', color: 'text-orange-600', bg: 'bg-orange-100' },
  accepted: { label: 'Accepted', color: 'text-green-600', bg: 'bg-green-100' },
  snoozed: { label: 'Snoozed', color: 'text-gray-600', bg: 'bg-gray-100' },
  dismissed: { label: 'Dismissed', color: 'text-red-600', bg: 'bg-red-100' },
}

export default function RecommendationsTab({ storeId }: RecommendationsTabProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'open' | 'accepted' | 'snoozed' | 'dismissed'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'restock' | 'reposition' | 'promote'>('all')

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({ storeId })
      if (filter !== 'all') params.append('status', filter)
      if (typeFilter !== 'all') params.append('type', typeFilter)
      
      const response = await fetch(`/api/recommendations?${params}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setRecommendations(result.recommendations)
        }
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [storeId, filter, typeFilter])

  const handleAction = async (id: string, action: 'accept' | 'snooze' | 'dismiss') => {
    try {
      const response = await fetch(`/api/recommendations/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        // Refresh recommendations
        fetchRecommendations()
      }
    } catch (error) {
      console.error('Failed to perform action:', error)
    }
  }

  const filteredRecommendations = recommendations.filter(rec => {
    if (filter !== 'all' && rec.status !== filter) return false
    if (typeFilter !== 'all' && rec.type !== typeFilter) return false
    return true
  })

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceStars = (confidence: number) => {
    const stars = Math.round(confidence * 5)
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">AI Recommendations</h2>
        </div>
        
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card-premium p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">AI Recommendations</h2>
        <div className="flex items-center space-x-4">
          <Brain className="w-6 h-6 text-primary-500" />
          <span className="text-sm text-gray-600">
            {filteredRecommendations.length} recommendations
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(['all', 'open', 'accepted', 'snoozed', 'dismissed'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors capitalize ${
                filter === option
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1">
          {(['all', 'restock', 'reposition', 'promote'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setTypeFilter(option)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors capitalize ${
                typeFilter === option
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations List */}
      {filteredRecommendations.length > 0 ? (
        <div className="space-y-6">
          {filteredRecommendations.map((rec) => {
            const typeConf = typeConfig[rec.type]
            const statusConf = statusConfig[rec.status]
            const TypeIcon = typeConf.icon

            return (
              <div key={rec.id} className="card-premium p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${typeConf.bg} rounded-lg flex items-center justify-center`}>
                      <TypeIcon className={`w-5 h-5 ${typeConf.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeConf.bg} ${typeConf.color}`}>
                          {typeConf.label}
                        </span>
                      </div>
                      <p className="text-gray-600">{rec.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusConf.bg} ${statusConf.color}`}>
                      {statusConf.label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex space-x-1">
                        {getConfidenceStars(rec.confidence)}
                      </div>
                      <span className={`text-sm font-medium ${getConfidenceColor(rec.confidence)}`}>
                        {Math.round(rec.confidence * 100)}% confidence
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">AI Confidence Score</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      Expected Impact
                    </div>
                    <p className="text-xs text-gray-600">{rec.impact}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      Created
                    </div>
                    <p className="text-xs text-gray-600">
                      {formatDate(rec.createdAt)}
                    </p>
                  </div>
                </div>

                {rec.status === 'open' && (
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleAction(rec.id, 'accept')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleAction(rec.id, 'snooze')}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Snooze
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleAction(rec.id, 'dismiss')}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Dismiss
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No recommendations found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or check back later for new AI recommendations.
          </p>
        </div>
      )}
    </div>
  )
}