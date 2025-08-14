import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { recommendationActionSchema } from '@/lib/validations'
import { z } from 'zod'

interface Params {
  id: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = params
    const body = await request.json()
    const validatedData = recommendationActionSchema.parse(body)
    
    const { action, notes } = validatedData
    
    // Check if recommendation exists
    const recommendation = await prisma.recommendation.findUnique({
      where: { id },
    })
    
    if (!recommendation) {
      return NextResponse.json(
        { success: false, error: 'Recommendation not found' },
        { status: 404 }
      )
    }
    
    // Update recommendation status
    const updatedRecommendation = await prisma.recommendation.update({
      where: { id },
      data: {
        status: action === 'accept' ? 'accepted' : 
                action === 'snooze' ? 'snoozed' : 'dismissed',
        updatedAt: new Date(),
      },
    })
    
    // In a real implementation, you might also:
    // - Log the action in an audit trail
    // - Send notifications
    // - Trigger automated actions for accepted recommendations
    
    return NextResponse.json({
      success: true,
      message: `Recommendation ${action}ed successfully`,
      recommendation: updatedRecommendation,
    })
    
  } catch (error) {
    console.error('Recommendation action API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid action data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}