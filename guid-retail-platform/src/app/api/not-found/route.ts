import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notFoundSchema } from '@/lib/validations'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = notFoundSchema.parse(body)
    
    const { storeId, kioskId, term, category, sessionId } = validatedData
    
    // Log the "not found" search
    const search = await prisma.search.create({
      data: {
        storeId,
        kioskId,
        term,
        category: category || 'Other',
        found: false,
        sessionId,
      },
    })
    
    return NextResponse.json({
      success: true,
      message: 'Product not found report logged successfully',
      searchId: search.id,
    })
    
  } catch (error) {
    console.error('Not found API error:', error)
    
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