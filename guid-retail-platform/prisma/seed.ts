import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  'Dairy & Eggs',
  'Fresh Produce',
  'Meat & Seafood',
  'Pantry & Dry Goods',
  'Frozen Foods',
  'Beverages',
  'Snacks & Candy',
  'Health & Beauty',
  'Baby & Kids',
  'Household & Cleaning',
  'Pet Care',
  'Bakery',
]

const products = [
  // Dairy & Eggs
  { name: 'Organic Whole Milk', category: 'Dairy & Eggs', aisle: 'A1', shelf: 'B2', sku: 'DRY001' },
  { name: 'Greek Yogurt - Vanilla', category: 'Dairy & Eggs', aisle: 'A1', shelf: 'C1', sku: 'DRY002' },
  { name: 'Free Range Eggs (Dozen)', category: 'Dairy & Eggs', aisle: 'A1', shelf: 'B1', sku: 'DRY003' },
  { name: 'Aged Cheddar Cheese', category: 'Dairy & Eggs', aisle: 'A1', shelf: 'D1', sku: 'DRY004' },
  { name: 'Butter - Unsalted', category: 'Dairy & Eggs', aisle: 'A1', shelf: 'B3', sku: 'DRY005' },
  
  // Fresh Produce
  { name: 'Bananas (bunch)', category: 'Fresh Produce', aisle: 'B1', shelf: 'A1', sku: 'PRD001' },
  { name: 'Organic Spinach', category: 'Fresh Produce', aisle: 'B1', shelf: 'C2', sku: 'PRD002' },
  { name: 'Red Apples (lb)', category: 'Fresh Produce', aisle: 'B1', shelf: 'A2', sku: 'PRD003' },
  { name: 'Fresh Avocados', category: 'Fresh Produce', aisle: 'B1', shelf: 'B1', sku: 'PRD004' },
  { name: 'Cherry Tomatoes', category: 'Fresh Produce', aisle: 'B1', shelf: 'C1', sku: 'PRD005' },
  { name: 'Organic Carrots', category: 'Fresh Produce', aisle: 'B1', shelf: 'D1', sku: 'PRD006' },
  
  // Meat & Seafood
  { name: 'Chicken Breast (boneless)', category: 'Meat & Seafood', aisle: 'C1', shelf: 'A1', sku: 'MEA001' },
  { name: 'Ground Beef (80/20)', category: 'Meat & Seafood', aisle: 'C1', shelf: 'A2', sku: 'MEA002' },
  { name: 'Atlantic Salmon Fillet', category: 'Meat & Seafood', aisle: 'C1', shelf: 'B1', sku: 'MEA003' },
  
  // Pantry & Dry Goods
  { name: 'Extra Virgin Olive Oil', category: 'Pantry & Dry Goods', aisle: 'D1', shelf: 'A1', sku: 'PAN001' },
  { name: 'Whole Grain Bread', category: 'Pantry & Dry Goods', aisle: 'D1', shelf: 'B1', sku: 'PAN002' },
  { name: 'Quinoa (organic)', category: 'Pantry & Dry Goods', aisle: 'D1', shelf: 'C1', sku: 'PAN003' },
  { name: 'Pasta - Spaghetti', category: 'Pantry & Dry Goods', aisle: 'D1', shelf: 'C2', sku: 'PAN004' },
  { name: 'Rice - Jasmine', category: 'Pantry & Dry Goods', aisle: 'D1', shelf: 'C3', sku: 'PAN005' },
  { name: 'Oats - Steel Cut', category: 'Pantry & Dry Goods', aisle: 'D1', shelf: 'D1', sku: 'PAN006' },
  
  // Frozen Foods
  { name: 'Frozen Blueberries', category: 'Frozen Foods', aisle: 'E1', shelf: 'A1', sku: 'FRZ001' },
  { name: 'Frozen Pizza - Margherita', category: 'Frozen Foods', aisle: 'E1', shelf: 'B1', sku: 'FRZ002' },
  { name: 'Ice Cream - Vanilla', category: 'Frozen Foods', aisle: 'E1', shelf: 'C1', sku: 'FRZ003' },
  
  // Beverages
  { name: 'Sparkling Water - Lemon', category: 'Beverages', aisle: 'F1', shelf: 'A1', sku: 'BEV001' },
  { name: 'Orange Juice (fresh)', category: 'Beverages', aisle: 'F1', shelf: 'B1', sku: 'BEV002' },
  { name: 'Coffee Beans - Medium Roast', category: 'Beverages', aisle: 'F1', shelf: 'C1', sku: 'BEV003' },
  
  // Health & Beauty
  { name: 'Toothpaste - Fluoride', category: 'Health & Beauty', aisle: 'G1', shelf: 'A1', sku: 'HLT001' },
  { name: 'Shampoo - Organic', category: 'Health & Beauty', aisle: 'G1', shelf: 'B1', sku: 'HLT002' },
  { name: 'Vitamins - Multivitamin', category: 'Health & Beauty', aisle: 'G1', shelf: 'C1', sku: 'HLT003' },
  
  // Baby & Kids
  { name: 'Baby Wipes - Sensitive', category: 'Baby & Kids', aisle: 'H1', shelf: 'A1', sku: 'BBY001' },
  { name: 'Diapers - Size 3', category: 'Baby & Kids', aisle: 'H1', shelf: 'B1', sku: 'BBY002' },
  
  // Household & Cleaning
  { name: 'Paper Towels (6-pack)', category: 'Household & Cleaning', aisle: 'I1', shelf: 'A1', sku: 'HSE001' },
  { name: 'Dish Soap - Citrus', category: 'Household & Cleaning', aisle: 'I1', shelf: 'B1', sku: 'HSE002' },
  { name: 'Laundry Detergent', category: 'Household & Cleaning', aisle: 'I1', shelf: 'C1', sku: 'HSE003' },
]

const searchTerms = [
  'milk', 'eggs', 'bread', 'cheese', 'butter', 'yogurt',
  'chicken', 'beef', 'salmon', 'fish',
  'apples', 'bananas', 'spinach', 'tomatoes', 'carrots', 'avocado',
  'olive oil', 'pasta', 'rice', 'quinoa', 'oats',
  'coffee', 'juice', 'water',
  'toothpaste', 'shampoo', 'vitamins',
  'baby wipes', 'diapers',
  'paper towels', 'dish soap', 'detergent',
  'ice cream', 'pizza', 'blueberries',
  // Some searches that won't be found
  'organic kale', 'coconut milk', 'gluten free pasta', 'almond butter',
  'protein powder', 'chia seeds', 'kombucha', 'tempeh'
]

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomDate(daysAgo: number): Date {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo))
  date.setHours(Math.floor(Math.random() * 16) + 8) // 8 AM to 11 PM
  date.setMinutes(Math.floor(Math.random() * 60))
  return date
}

async function main() {
  console.log('Starting seed...')

  // Create store
  const store = await prisma.store.create({
    data: {
      name: 'Guid Demo Store',
      locale: 'en',
    },
  })

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@guidstore.com',
      name: 'Store Admin',
      role: 'admin',
    },
  })

  // Link admin to store
  await prisma.userStore.create({
    data: {
      userId: adminUser.id,
      storeId: store.id,
      role: 'admin',
    },
  })

  // Create manager user
  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@guidstore.com',
      name: 'Store Manager',
      role: 'manager',
    },
  })

  // Link manager to store
  await prisma.userStore.create({
    data: {
      userId: managerUser.id,
      storeId: store.id,
      role: 'manager',
    },
  })

  // Create kiosks
  const kiosks = await Promise.all([
    prisma.kiosk.create({
      data: {
        name: 'Main Entrance Kiosk',
        storeId: store.id,
      },
    }),
    prisma.kiosk.create({
      data: {
        name: 'Produce Section Kiosk',
        storeId: store.id,
      },
    }),
    prisma.kiosk.create({
      data: {
        name: 'Customer Service Kiosk',
        storeId: store.id,
      },
    }),
  ])

  // Create products
  console.log('Creating products...')
  const createdProducts = await Promise.all(
    products.map((product) =>
      prisma.product.create({
        data: {
          ...product,
          storeId: store.id,
          price: Math.floor(Math.random() * 2000) / 100 + 1, // $1.00 to $21.00
          inStock: Math.random() > 0.1, // 90% in stock
        },
      })
    )
  )

  // Create searches (realistic distribution over last 60 days)
  console.log('Creating search history...')
  const searches = []
  
  for (let i = 0; i < 5000; i++) {
    const term = getRandomElement(searchTerms)
    const kiosk = getRandomElement(kiosks)
    
    // Try to find matching product
    const matchingProduct = createdProducts.find(p => 
      p.name.toLowerCase().includes(term.toLowerCase()) ||
      term.toLowerCase().includes(p.name.toLowerCase().split(' ')[0])
    )
    
    // 65% chance of finding something if there's a match, 5% chance if no match
    const found = matchingProduct ? Math.random() < 0.65 : Math.random() < 0.05
    
    searches.push({
      term,
      storeId: store.id,
      kioskId: kiosk.id,
      found,
      productId: found && matchingProduct ? matchingProduct.id : null,
      category: matchingProduct?.category || getRandomElement(categories),
      createdAt: getRandomDate(60),
    })
  }
  
  // Batch create searches
  await prisma.search.createMany({
    data: searches,
  })

  // Create some recommendations
  console.log('Creating AI recommendations...')
  const recommendations = [
    {
      type: 'restock',
      title: 'Restock Organic Spinach',
      description: 'High demand with 45 searches in the past week but currently out of stock',
      payload: JSON.stringify({
        productName: 'Organic Spinach',
        currentStock: 0,
        recommendedOrder: 24,
        priority: 'high'
      }),
      confidence: 0.92,
      impact: 'Could recover $280 in lost sales per week',
      storeId: store.id,
    },
    {
      type: 'reposition',
      title: 'Move Greek Yogurt to Eye Level',
      description: 'Popular item currently placed too low, causing customer search difficulty',
      payload: JSON.stringify({
        productName: 'Greek Yogurt - Vanilla',
        currentLocation: 'A1-C1',
        recommendedLocation: 'A1-B2',
        reason: 'eye_level_optimization'
      }),
      confidence: 0.78,
      impact: 'Estimated 15% increase in discovery rate',
      storeId: store.id,
    },
    {
      type: 'promote',
      title: 'Feature Quinoa in Health Food Display',
      description: 'Growing search trend for quinoa suggests increasing health-conscious customer base',
      payload: JSON.stringify({
        productName: 'Quinoa (organic)',
        currentLocation: 'D1-C1',
        promotionType: 'end_cap_display',
        duration: '2_weeks'
      }),
      confidence: 0.85,
      impact: 'Projected 25% sales increase for featured period',
      storeId: store.id,
    },
    {
      type: 'restock',
      title: 'Increase Baby Wipes Inventory',
      description: 'Consistently high demand, often running low by mid-week',
      payload: JSON.stringify({
        productName: 'Baby Wipes - Sensitive',
        currentStock: 12,
        recommendedOrder: 48,
        priority: 'medium'
      }),
      confidence: 0.88,
      impact: 'Prevent stockouts affecting young families',
      storeId: store.id,
    }
  ]

  await Promise.all(
    recommendations.map((rec) =>
      prisma.recommendation.create({ data: rec })
    )
  )

  console.log('Seed completed successfully!')
  console.log(`Created:`)
  console.log(`- 1 store: ${store.name}`)
  console.log(`- 2 users (admin, manager)`)
  console.log(`- 3 kiosks`)
  console.log(`- ${products.length} products`)
  console.log(`- 5000 search records`)
  console.log(`- 4 AI recommendations`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })