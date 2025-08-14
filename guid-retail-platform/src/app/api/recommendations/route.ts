import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { recommendationQuerySchema } from '@/lib/validations'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryData = Object.fromEntries(searchParams.entries())
    
    const validatedQuery = recommendationQuerySchema.parse(queryData)
    const { storeId, status, type } = validatedQuery
    
    const where: any = { storeId }
    if (status) where.status = status
    if (type) where.type = type
    
    const recommendations = await prisma.recommendation.findMany({
      where,
      orderBy: [
        { status: 'asc' }, // Open first
        { confidence: 'desc' }, // Higher confidence first
        { createdAt: 'desc' }, // Newer first
      ],
    })
    
    return NextResponse.json({
      success: true,
      recommendations,
    })
    
  } catch (error) {
    console.error('Recommendations GET API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}