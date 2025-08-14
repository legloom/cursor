import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { searchSchema } from '@/lib/validations'
import { z } from 'zod'

// Simple fuzzy matching function
function fuzzyMatch(searchTerm: string, productName: string): boolean {
  const term = searchTerm.toLowerCase().trim()
  const name = productName.toLowerCase()
  
  // Exact match
  if (name.includes(term)) return true
  
  // Word matching
  const termWords = term.split(' ')
  const nameWords = name.split(' ')
  
  return termWords.every(termWord => 
    nameWords.some(nameWord => 
      nameWord.startsWith(termWord) || 
      nameWord.includes(termWord)
    )
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = searchSchema.parse(body)
    
    const { storeId, kioskId, term, sessionId } = validatedData
    
    // Find matching products in the store
    const products = await prisma.product.findMany({
      where: {
        storeId,
        inStock: true,
      },
    })
    
    // Find the best match
    const matchingProduct = products.find(product => 
      fuzzyMatch(term, product.name)
    )
    
    // Determine category if no product match
    let category = matchingProduct?.category
    if (!category) {
      // Simple category inference based on search term
      const term_lower = term.toLowerCase()
      if (term_lower.includes('milk') || term_lower.includes('cheese') || term_lower.includes('egg') || term_lower.includes('butter') || term_lower.includes('yogurt')) {
        category = 'Dairy & Eggs'
      } else if (term_lower.includes('apple') || term_lower.includes('banana') || term_lower.includes('spinach') || term_lower.includes('carrot') || term_lower.includes('tomato')) {
        category = 'Fresh Produce'
      } else if (term_lower.includes('chicken') || term_lower.includes('beef') || term_lower.includes('fish') || term_lower.includes('salmon')) {
        category = 'Meat & Seafood'
      } else if (term_lower.includes('bread') || term_lower.includes('pasta') || term_lower.includes('rice') || term_lower.includes('oil')) {
        category = 'Pantry & Dry Goods'
      } else if (term_lower.includes('coffee') || term_lower.includes('juice') || term_lower.includes('water')) {
        category = 'Beverages'
      } else if (term_lower.includes('soap') || term_lower.includes('detergent') || term_lower.includes('paper')) {
        category = 'Household & Cleaning'
      } else if (term_lower.includes('baby') || term_lower.includes('diaper') || term_lower.includes('wipe')) {
        category = 'Baby & Kids'
      } else if (term_lower.includes('shampoo') || term_lower.includes('toothpaste') || term_lower.includes('vitamin')) {
        category = 'Health & Beauty'
      } else {
        category = 'Other'
      }
    }
    
    // Log the search
    const search = await prisma.search.create({
      data: {
        storeId,
        kioskId,
        term,
        category,
        found: !!matchingProduct,
        productId: matchingProduct?.id,
        sessionId,
      },
      include: {
        product: true,
      },
    })
    
    // Return search result
    return NextResponse.json({
      success: true,
      found: !!matchingProduct,
      product: matchingProduct ? {
        id: matchingProduct.id,
        name: matchingProduct.name,
        category: matchingProduct.category,
        aisle: matchingProduct.aisle,
        shelf: matchingProduct.shelf,
        price: matchingProduct.price,
      } : null,
      searchId: search.id,
      category,
    })
    
  } catch (error) {
    console.error('Search API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryData = Object.fromEntries(searchParams.entries())
    
    // For GET requests, we'll return recent searches or search by criteria
    const { storeId, page = '1', limit = '20', category, found, startDate, endDate } = queryData
    
    if (!storeId) {
      return NextResponse.json(
        { success: false, error: 'Store ID is required' },
        { status: 400 }
      )
    }
    
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum
    
    const where: any = { storeId }
    
    if (category) where.category = category
    if (found !== undefined) where.found = found === 'true'
    if (startDate) where.createdAt = { ...where.createdAt, gte: new Date(startDate) }
    if (endDate) where.createdAt = { ...where.createdAt, lte: new Date(endDate) }
    
    const [searches, total] = await Promise.all([
      prisma.search.findMany({
        where,
        include: {
          product: true,
          kiosk: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.search.count({ where }),
    ])
    
    return NextResponse.json({
      success: true,
      searches,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    })
    
  } catch (error) {
    console.error('Search GET API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}