# 🚀 Deployment Guide - Guid Retail Analytics Platform

This guide will help you deploy the Guid retail analytics platform to production.

## 🌐 Quick Deploy to Vercel (Recommended)

### 1. One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/guid-retail-platform)

### 2. Manual Vercel Deployment

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy the application**:
   ```bash
   vercel --prod
   ```

3. **Set up environment variables** in Vercel dashboard:
   - `DATABASE_PROVIDER` = `postgresql`
   - `DATABASE_URL` = Your PostgreSQL connection string
   - `NEXTAUTH_SECRET` = Strong random secret
   - `NEXTAUTH_URL` = Your production domain
   - `NEXT_PUBLIC_APP_URL` = Your production domain

4. **Set up database** (Vercel Postgres recommended):
   ```bash
   vercel env pull .env.production
   npx prisma db push
   npm run db:seed
   ```

## 🗄️ Database Options

### Option 1: Vercel Postgres (Recommended)
1. Go to your Vercel project dashboard
2. Navigate to Storage tab
3. Create a new Postgres database
4. Copy the connection string to `DATABASE_URL`

### Option 2: Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > Database
3. Copy the connection string to `DATABASE_URL`

### Option 3: Railway
1. Create account at [railway.app](https://railway.app)
2. Create a new PostgreSQL service
3. Copy the connection string to `DATABASE_URL`

## 🔧 Environment Variables

Create these environment variables in your deployment platform:

```env
# Database (Required)
DATABASE_PROVIDER=postgresql
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication (Required)
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars
NEXTAUTH_URL=https://your-domain.vercel.app

# App Configuration (Required)
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Email (Optional)
RESEND_API_KEY=your-resend-api-key
```

## 🛠️ Manual Deployment Steps

### 1. Prepare the codebase
```bash
# Clone the repository
git clone <your-repo-url>
cd guid-retail-platform

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate
```

### 2. Set up environment variables
```bash
cp .env.example .env.production
# Edit .env.production with your production values
```

### 3. Build the application
```bash
npm run build
```

### 4. Set up the database
```bash
# Push schema to database
npx prisma db push

# Seed with demo data
npm run db:seed
```

### 5. Deploy
```bash
# Deploy to your platform
npm run start
```

## 🏗️ Platform-Specific Instructions

### Vercel
- Automatic deployments from Git
- Built-in database options
- Serverless functions for API routes
- Global CDN

### Netlify
- Connect GitHub repository
- Build command: `npm run build`
- Publish directory: `.next`
- Functions directory: `netlify/functions`

### Railway
- Connect GitHub repository
- Automatic PostgreSQL database
- Environment variable management
- Custom domains

### AWS Amplify
- Connect GitHub repository
- Build specification included
- Environment variable configuration
- Global deployment

## 🔍 Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] Database connection working
- [ ] Search functionality operational
- [ ] Admin dashboard accessible
- [ ] Analytics data populated
- [ ] AI recommendations visible
- [ ] All API endpoints responding
- [ ] Environment variables configured
- [ ] SSL certificate active
- [ ] Domain configured correctly

## 🐛 Troubleshooting

### Database Connection Issues
1. Verify `DATABASE_URL` format
2. Check database server accessibility
3. Confirm credentials are correct
4. Ensure database exists

### Build Failures
1. Check Node.js version (18+ required)
2. Clear node_modules and reinstall
3. Verify all environment variables
4. Check for TypeScript errors

### Authentication Issues
1. Verify `NEXTAUTH_SECRET` is set
2. Check `NEXTAUTH_URL` matches domain
3. Confirm callback URLs configured

## 📊 Performance Optimization

### Database
- Enable connection pooling
- Set up read replicas for analytics
- Index frequently queried columns
- Archive old search data

### Application
- Enable Vercel Analytics
- Configure edge caching
- Optimize images with next/image
- Monitor Core Web Vitals

### Monitoring
- Set up error tracking (Sentry)
- Configure uptime monitoring
- Enable performance monitoring
- Set up log aggregation

## 🔒 Security

- Use strong `NEXTAUTH_SECRET`
- Enable HTTPS only
- Configure CSP headers
- Regular dependency updates
- Database connection encryption
- Rate limiting on API routes

## 📈 Scaling

### Horizontal Scaling
- Database connection pooling
- Redis for session storage
- CDN for static assets
- Load balancing

### Vertical Scaling
- Upgrade database tier
- Increase serverless limits
- Optimize database queries
- Implement caching strategies

## 🆘 Support

For deployment support:
1. Check the [troubleshooting section](#troubleshooting)
2. Review platform-specific documentation
3. Check application logs
4. Verify environment configuration

---

**Ready to deploy your retail analytics platform! 🚀**