import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    
    // Get all stores and their kiosks
    const stores = await prisma.store.findMany({
      include: {
        kiosks: true,
        _count: {
          select: {
            products: true,
            searches: true,
          },
        },
      },
      ...(storeId ? { where: { id: storeId } } : {}),
    })
    
    // Get available locales
    const locales = [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' },
    ]
    
    // Get product categories from existing products
    const categories = await prisma.product.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
      where: {
        category: {
          not: null,
        },
      },
    })
    
    const uniqueCategories = categories
      .map(p => p.category)
      .filter(Boolean)
      .sort()
    
    return NextResponse.json({
      success: true,
      config: {
        stores: stores.map(store => ({
          id: store.id,
          name: store.name,
          locale: store.locale,
          productCount: store._count.products,
          searchCount: store._count.searches,
          kiosks: store.kiosks.map(kiosk => ({
            id: kiosk.id,
            name: kiosk.name,
            createdAt: kiosk.createdAt,
          })),
        })),
        locales,
        categories: uniqueCategories,
      },
    })
    
  } catch (error) {
    console.error('Config API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}