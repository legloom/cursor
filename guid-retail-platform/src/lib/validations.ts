import { z } from 'zod'

// Search validation
export const searchSchema = z.object({
  storeId: z.string().cuid(),
  kioskId: z.string().cuid().optional(),
  term: z.string().min(1).max(100),
  sessionId: z.string().optional(),
})

export const searchQuerySchema = z.object({
  storeId: z.string().cuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  category: z.string().optional(),
  found: z.coerce.boolean().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// Not found product validation
export const notFoundSchema = z.object({
  storeId: z.string().cuid(),
  kioskId: z.string().cuid().optional(),
  term: z.string().min(1).max(100),
  category: z.string().optional(),
  sessionId: z.string().optional(),
})

// Inventory upload validation
export const inventoryUploadSchema = z.object({
  storeId: z.string().cuid(),
  products: z.array(z.object({
    name: z.string().min(1),
    sku: z.string().optional(),
    category: z.string().optional(),
    aisle: z.string().optional(),
    shelf: z.string().optional(),
    inStock: z.boolean().default(true),
    price: z.number().min(0).optional(),
  })),
})

// Analytics validation
export const analyticsQuerySchema = z.object({
  storeId: z.string().cuid(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  period: z.enum(['7d', '30d', '90d', 'custom']).default('30d'),
})

export const trendsQuerySchema = z.object({
  storeId: z.string().cuid(),
  period: z.enum(['7d', '30d', '90d']).default('30d'),
  groupBy: z.enum(['hour', 'day', 'week']).default('day'),
})

export const topQueriesSchema = z.object({
  storeId: z.string().cuid(),
  timeframe: z.enum(['24h', '7d', '30d']).default('7d'),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  type: z.enum(['all', 'found', 'not_found']).default('all'),
})

// Recommendations validation
export const recommendationActionSchema = z.object({
  action: z.enum(['accept', 'snooze', 'dismiss']),
  notes: z.string().optional(),
})

export const recommendationQuerySchema = z.object({
  storeId: z.string().cuid(),
  status: z.enum(['open', 'accepted', 'snoozed', 'dismissed']).optional(),
  type: z.enum(['restock', 'reposition', 'promote']).optional(),
})

// User management validation
export const userCreateSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(['staff', 'manager', 'admin']).default('staff'),
  storeIds: z.array(z.string().cuid()),
})

export const userUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(['staff', 'manager', 'admin']).optional(),
  storeIds: z.array(z.string().cuid()).optional(),
})

// Store management validation
export const storeCreateSchema = z.object({
  name: z.string().min(1),
  locale: z.string().default('en'),
})

export const storeUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  locale: z.string().optional(),
})

// Kiosk management validation
export const kioskCreateSchema = z.object({
  name: z.string().min(1),
  storeId: z.string().cuid(),
})

export const kioskUpdateSchema = z.object({
  name: z.string().min(1).optional(),
})

// Product management validation
export const productCreateSchema = z.object({
  name: z.string().min(1),
  sku: z.string().optional(),
  category: z.string().optional(),
  aisle: z.string().optional(),
  shelf: z.string().optional(),
  inStock: z.boolean().default(true),
  price: z.number().min(0).optional(),
  storeId: z.string().cuid(),
})

export const productUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  sku: z.string().optional(),
  category: z.string().optional(),
  aisle: z.string().optional(),
  shelf: z.string().optional(),
  inStock: z.boolean().optional(),
  price: z.number().min(0).optional(),
})

export const productQuerySchema = z.object({
  storeId: z.string().cuid(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  category: z.string().optional(),
  inStock: z.coerce.boolean().optional(),
  search: z.string().optional(),
})

// Real-time data validation
export const realtimeQuerySchema = z.object({
  storeId: z.string().cuid(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

// Export types
export type SearchInput = z.infer<typeof searchSchema>
export type SearchQuery = z.infer<typeof searchQuerySchema>
export type NotFoundInput = z.infer<typeof notFoundSchema>
export type InventoryUpload = z.infer<typeof inventoryUploadSchema>
export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>
export type TrendsQuery = z.infer<typeof trendsQuerySchema>
export type TopQueriesQuery = z.infer<typeof topQueriesSchema>
export type RecommendationAction = z.infer<typeof recommendationActionSchema>
export type RecommendationQuery = z.infer<typeof recommendationQuerySchema>
export type UserCreate = z.infer<typeof userCreateSchema>
export type UserUpdate = z.infer<typeof userUpdateSchema>
export type StoreCreate = z.infer<typeof storeCreateSchema>
export type StoreUpdate = z.infer<typeof storeUpdateSchema>
export type KioskCreate = z.infer<typeof kioskCreateSchema>
export type KioskUpdate = z.infer<typeof kioskUpdateSchema>
export type ProductCreate = z.infer<typeof productCreateSchema>
export type ProductUpdate = z.infer<typeof productUpdateSchema>
export type ProductQuery = z.infer<typeof productQuerySchema>
export type RealtimeQuery = z.infer<typeof realtimeQuerySchema>