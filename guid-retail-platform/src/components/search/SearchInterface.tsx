'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Package, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { generateSessionId } from '@/lib/utils'

interface Product {
  id: string
  name: string
  category: string
  aisle?: string
  shelf?: string
  price?: number
}

interface SearchResult {
  success: boolean
  found: boolean
  product?: Product
  searchId: string
  category: string
}

interface DemoStore {
  id: string
  name: string
  locale: string
  kiosks: Array<{
    id: string
    name: string
  }>
}

const SEARCH_CHIPS = [
  'Olive Oil',
  'Greek Yogurt',
  'Whole Grain Bread',
  'Baby Wipes',
  'Fresh Spinach',
  'Coffee Beans',
  'Chicken Breast',
  'Paper Towels',
]

export default function SearchInterface() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => generateSessionId())
  const [showNotFoundForm, setShowNotFoundForm] = useState(false)
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

  const handleSearch = async (term: string) => {
    if (!term.trim() || !demoStore) return

    setIsLoading(true)
    setSearchResult(null)
    setShowNotFoundForm(false)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeId: demoStore.id,
          term: term.trim(),
          sessionId,
          kioskId: demoStore.kiosks[0]?.id, // Use first kiosk for demo
        }),
      })

      if (response.ok) {
        const result: SearchResult = await response.json()
        setSearchResult(result)
      } else {
        console.error('Search failed')
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotFoundReport = async () => {
    if (!searchTerm.trim() || !demoStore) return

    try {
      const response = await fetch('/api/not-found', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeId: demoStore.id,
          term: searchTerm.trim(),
          sessionId,
          kioskId: demoStore.kiosks[0]?.id,
        }),
      })

      if (response.ok) {
        setShowNotFoundForm(false)
        // Show success message
        alert('Thank you for reporting this missing product!')
      }
    } catch (error) {
      console.error('Report error:', error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchTerm)
  }

  const handleChipClick = (term: string) => {
    setSearchTerm(term)
    handleSearch(term)
  }

  if (isLoadingStore) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store...</p>
        </div>
      </div>
    )
  }

  if (!demoStore) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load store data. Please refresh the page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Guid Store</h1>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{demoStore.name}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Find what you need
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Search our store inventory to quickly locate products and get aisle information
            </p>

            {/* Search Form */}
            <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for products..."
                  className="search-input pl-16 pr-6"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !searchTerm.trim()}
                className="mt-4"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </form>

            {/* Quick Search Chips */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <span className="text-sm text-gray-600 mr-4">Quick search:</span>
              {SEARCH_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleChipClick(chip)}
                  className="chip chip-default"
                  disabled={isLoading}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          {searchResult && (
            <div className="max-w-2xl mx-auto">
              {searchResult.found && searchResult.product ? (
                <div className="card-premium p-8 text-center animate-fade-in">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Found: {searchResult.product.name}
                  </h3>
                  <div className="space-y-3 text-gray-600 mb-6">
                    <p className="flex items-center justify-center space-x-2">
                      <MapPin className="w-5 h-5" />
                      <span>
                        <strong>Location:</strong> Aisle {searchResult.product.aisle}, Shelf {searchResult.product.shelf}
                      </span>
                    </p>
                    <p>
                      <strong>Category:</strong> {searchResult.product.category}
                    </p>
                    {searchResult.product.price && (
                      <p>
                        <strong>Price:</strong> ${searchResult.product.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <Button variant="outline">
                    Show Related Products
                  </Button>
                </div>
              ) : (
                <div className="card-premium p-8 text-center animate-fade-in">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Product not found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We couldn't find "{searchTerm}" in our current inventory.
                  </p>
                  {!showNotFoundForm ? (
                    <Button
                      onClick={() => setShowNotFoundForm(true)}
                      variant="outline"
                    >
                      Report Missing Product
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Help us improve by reporting this missing product:
                      </p>
                      <div className="flex space-x-3 justify-center">
                        <Button onClick={handleNotFoundReport}>
                          Report Missing
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowNotFoundForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Info Section */}
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-500">
              Every search helps your store improve availability and layout.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
          <p>Powered by Guid Retail Analytics Platform</p>
        </div>
      </footer>
    </div>
  )
}