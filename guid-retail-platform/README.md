# Guid Retail Analytics Platform

A comprehensive retail analytics platform that captures in-store customer searches, analyzes them, and turns them into actionable insights for store managers.

## 🚀 Features

### Customer Search Interface (`/`)
- **Search-first homepage** with large search bar and quick search chips
- **Product location finder** with aisle and shelf information
- **Missing product reporting** to help stores improve inventory
- **Premium UI** with clean design and smooth animations

### Manager Dashboard (`/admin`)
- **Overview Tab**: KPI cards with deltas, missing product insights, search trends
- **Search Analytics**: Time trends, top queries, conversion metrics (placeholder)
- **Inventory Upload**: CSV import with column mapping (placeholder)
- **Real-Time Data**: Live search monitoring with sparklines (placeholder)
- **AI Recommendations**: Smart actionable recommendations with confidence scoring
- **AI Engine**: Threshold tuning and rule configuration (placeholder)
- **Settings**: Store and team management (placeholder)

### AI-Powered Recommendations
- **Restock recommendations** based on search patterns and inventory
- **Product repositioning** suggestions for better discoverability
- **Promotion opportunities** based on search trends
- **Confidence scoring** with 5-star rating system
- **Action management** (Accept/Snooze/Dismiss)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, custom design system, Lucide icons
- **Database**: Prisma ORM with SQLite (demo), comprehensive schema
- **API**: Next.js Route Handlers with Zod validation
- **State**: React hooks, fetch for data fetching
- **Testing**: Ready for Playwright (e2e) and Vitest (unit)

## 📊 Database Schema

Complete retail analytics schema with:
- **Stores** and **Kiosks** for multi-location support
- **Products** with categories, aisle/shelf locations, and pricing
- **Searches** with fuzzy matching and category inference
- **AI Recommendations** with confidence scoring and status tracking
- **Users** and **UserStore** for role-based access (ready for NextAuth)

## 🎯 Demo Data

Seeded with realistic data:
- 1 demo store with 3 kiosks
- 34+ products across 12 categories
- 5,000 historical searches over 60 days
- 4 AI recommendations of different types
- Realistic search patterns and success rates

## 🚀 Getting Started

1. **Clone and install dependencies**:
   ```bash
   cd guid-retail-platform
   npm install
   ```

2. **Set up the database**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Visit the application**:
   - Customer interface: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin

## 🧪 Try the Demo

### Customer Search
- Try searching for products like "milk", "bread", "olive oil"
- Use the quick search chips for instant results
- Try searching for items not in inventory like "coconut milk"
- Report missing products to see the feedback flow

### Admin Dashboard
- Navigate through all tabs to see the interface
- View KPI metrics and trends in the Overview
- Browse AI recommendations and try accepting/dismissing them
- Filter recommendations by type and status

## 🔗 API Endpoints

### Search & Analytics
- `POST /api/search` - Log customer searches with fuzzy matching
- `POST /api/not-found` - Report missing products
- `GET /api/analytics/overview` - KPI metrics with period comparison
- `GET /api/config` - Store configuration and metadata

### AI Recommendations
- `GET /api/recommendations` - Fetch recommendations with filtering
- `POST /api/recommendations/:id/action` - Accept/snooze/dismiss recommendations

### Demo Utilities
- `GET /api/demo/store` - Get demo store information

## 🎨 Design System

Premium retail-focused design with:
- **Colors**: White backgrounds, high contrast headings, blue (#1976D2) CTAs
- **Typography**: Clean hierarchy with generous spacing
- **Cards**: Rounded corners (2xl), subtle shadows, hover effects
- **Buttons**: Rounded (xl), proper states, icon integration
- **Loading**: Skeleton states and smooth transitions

## 📱 Responsive Design

Fully responsive interface that works on:
- Desktop dashboards for store managers
- Tablet interfaces for kiosk deployments
- Mobile for on-the-go store staff

## 🔄 Future Enhancements

Ready for implementation:
- **NextAuth integration** for proper authentication
- **Recharts/ECharts** for advanced data visualization
- **Real-time updates** with WebSocket/SSE for live search monitoring
- **Internationalization** with next-intl (EN/FR)
- **Email reporting** with Resend for weekly insights
- **Advanced search analytics** with behavior flow visualization
- **CSV inventory management** with drag-and-drop upload
- **Role-based permissions** (customer, staff, manager, admin)

## 🏗️ Architecture

**Scalable and Production-Ready**:
- Clean separation of concerns
- Type-safe with TypeScript throughout
- Comprehensive validation with Zod
- Optimized database queries with Prisma
- RESTful API design
- Component-based architecture
- Extensible admin dashboard framework

## 📄 License

Built for demonstration purposes. Ready for production deployment with proper environment configuration.

---

**Guid** - Turning customer searches into retail insights 📊✨
