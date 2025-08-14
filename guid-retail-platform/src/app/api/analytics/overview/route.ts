import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { analyticsQuerySchema } from '@/lib/validations'
import { z } from 'zod'

function getDateRange(period: string, startDate?: string, endDate?: string) {
  const now = new Date()
  let start: Date
  let end: Date = now
  
  if (period === 'custom' && startDate && endDate) {
    start = new Date(startDate)
    end = new Date(endDate)
  } else {
    switch (period) {
      case '7d':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }
  }
  
  return { start, end }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryData = Object.fromEntries(searchParams.entries())
    
    const validatedQuery = analyticsQuerySchema.parse(queryData)
    const { storeId, period, startDate, endDate } = validatedQuery
    
    const { start, end } = getDateRange(period, startDate, endDate)
    
    // Get previous period for comparison
    const periodDuration = end.getTime() - start.getTime()
    const prevStart = new Date(start.getTime() - periodDuration)
    const prevEnd = new Date(start.getTime())
    
    // Current period stats
    const [
      totalSearches,
      foundSearches,
      missingProducts,
      dailySearches,
    ] = await Promise.all([
      // Total searches in period
      prisma.search.count({
        where: {
          storeId,
          createdAt: { gte: start, lte: end },
        },
      }),
      
      // Found searches in period
      prisma.search.count({
        where: {
          storeId,
          found: true,
          createdAt: { gte: start, lte: end },
        },
      }),
      
      // Unique missing products (not found searches)
      prisma.search.groupBy({
        by: ['term'],
        where: {
          storeId,
          found: false,
          createdAt: { gte: start, lte: end },
        },
        _count: {
          term: true,
        },
      }),
      
      // Daily search counts for average calculation
      prisma.$queryRaw`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM "Search"
        WHERE store_id = ${storeId}
          AND created_at >= ${start}
          AND created_at <= ${end}
        GROUP BY DATE(created_at)
        ORDER BY date
      ` as Array<{ date: string; count: bigint }>,
    ])
    
    // Previous period stats for comparison
    const [
      prevTotalSearches,
      prevFoundSearches,
      prevMissingCount,
    ] = await Promise.all([
      prisma.search.count({
        where: {
          storeId,
          createdAt: { gte: prevStart, lte: prevEnd },
        },
      }),
      
      prisma.search.count({
        where: {
          storeId,
          found: true,
          createdAt: { gte: prevStart, lte: prevEnd },
        },
      }),
      
      prisma.search.groupBy({
        by: ['term'],
        where: {
          storeId,
          found: false,
          createdAt: { gte: prevStart, lte: prevEnd },
        },
        _count: {
          term: true,
        },
      }),
    ])
    
    // Calculate metrics
    const successRate = totalSearches > 0 ? (foundSearches / totalSearches) * 100 : 0
    const prevSuccessRate = prevTotalSearches > 0 ? (prevFoundSearches / prevTotalSearches) * 100 : 0
    
    const missingCount = missingProducts.length
    const prevMissingProductCount = prevMissingCount.length
    
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
    const dailyAverage = totalSearches / days
    const prevDailyAverage = prevTotalSearches / Math.max(1, Math.ceil((prevEnd.getTime() - prevStart.getTime()) / (1000 * 60 * 60 * 24)))
    
    // Calculate deltas
    const totalSearchesDelta = prevTotalSearches > 0 ? 
      ((totalSearches - prevTotalSearches) / prevTotalSearches) * 100 : 0
    const successRateDelta = prevSuccessRate > 0 ? 
      ((successRate - prevSuccessRate) / prevSuccessRate) * 100 : 0
    const missingCountDelta = prevMissingProductCount > 0 ? 
      ((missingCount - prevMissingProductCount) / prevMissingProductCount) * 100 : 0
    const dailyAverageDelta = prevDailyAverage > 0 ? 
      ((dailyAverage - prevDailyAverage) / prevDailyAverage) * 100 : 0
    
    // Get most requested missing products
    const topMissingProducts = await prisma.search.groupBy({
      by: ['term'],
      where: {
        storeId,
        found: false,
        createdAt: { gte: start, lte: end },
      },
      _count: {
        term: true,
      },
      orderBy: {
        _count: {
          term: 'desc',
        },
      },
      take: 10,
    })
    
    return NextResponse.json({
      success: true,
      overview: {
        totalSearches: {
          value: totalSearches,
          delta: totalSearchesDelta,
        },
        successRate: {
          value: Math.round(successRate * 100) / 100,
          delta: successRateDelta,
        },
        missingProducts: {
          value: missingCount,
          delta: missingCountDelta,
        },
        dailyAverage: {
          value: Math.round(dailyAverage * 100) / 100,
          delta: dailyAverageDelta,
        },
      },
      topMissingProducts: topMissingProducts.map(item => ({
        term: item.term,
        count: item._count.term,
      })),
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
        days,
      },
    })
    
  } catch (error) {
    console.error('Analytics overview API error:', error)
    
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