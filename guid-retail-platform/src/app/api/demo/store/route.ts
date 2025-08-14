import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get the demo store
    const store = await prisma.store.findFirst({
      include: {
        kiosks: true,
      },
    })
    
    if (!store) {
      return NextResponse.json(
        { success: false, error: 'No demo store found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      store: {
        id: store.id,
        name: store.name,
        locale: store.locale,
        kiosks: store.kiosks.map(kiosk => ({
          id: kiosk.id,
          name: kiosk.name,
        })),
      },
    })
    
  } catch (error) {
    console.error('Demo store API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}