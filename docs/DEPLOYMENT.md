# Deployment Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Vercel account
- Pi Network API credentials
- GitHub repository connected to Vercel

## Environment Variables Setup

Create a `.env.production` file with these variables:

```env
# Pi Network Configuration (Production)
REACT_APP_PI_API_KEY=your_production_pi_api_key
REACT_APP_PI_WALLET_ADDRESS=your_production_wallet_address
REACT_APP_PI_APP_ID=your_production_app_id
REACT_APP_PI_ENVIRONMENT=mainnet  # Use mainnet for production

# Backend
BACKEND_PORT=5000
NODE_ENV=production
JWT_SECRET=your_very_secure_jwt_secret_key

# Vercel
VERCEL_URL=your-vercel-deployment-url.vercel.app
```

## Deployment Steps

### 1. Vercel Deployment

#### Option A: Automatic Deployment (Recommended)

1. Push code to GitHub main/master branch
2. Vercel automatically deploys
3. Set environment variables in Vercel dashboard:
   - Project Settings → Environment Variables
   - Add all variables from `.env.production`

#### Option B: Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### 2. Configure Vercel Environment

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add variables for:
   - Production (REACT_APP_PI_ENVIRONMENT=mainnet)
   - Preview (REACT_APP_PI_ENVIRONMENT=testnet)

### 3. Configure Build Settings

Vercel automatically detects:
- Build Command: `npm run build`
- Output Directory: `build/`
- Install Command: `npm install`

### 4. Domain Configuration

1. Add custom domain in Vercel dashboard
2. Update DNS records as instructed
3. Wait for SSL certificate provisioning

## Production Checklist

- [ ] Environment variables set in Vercel
- [ ] JWT_SECRET is strong and unique
- [ ] Pi API keys are production keys
- [ ] Pi environment set to mainnet
- [ ] HTTPS is enforced
- [ ] CORS is configured for production domain
- [ ] Database is set up (if using)
- [ ] Payment verification is enabled
- [ ] Error logging is configured
- [ ] Monitoring is set up

## Post-Deployment

### Health Check

```bash
curl https://your-domain.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "environment": "production",
  "piEnvironment": "mainnet"
}
```

### Monitor

1. Vercel Analytics: Monitor performance
2. Error Tracking: Use Sentry or similar
3. Payment Logs: Monitor payment transactions
4. User Activity: Track key metrics

## Troubleshooting

### Build Fails

- Check Node.js version (should be 18+)
- Verify all dependencies in package.json
- Check build logs in Vercel dashboard

### Environment Variables Not Working

- Verify variables are set in Vercel dashboard
- Rebuild deployment after adding variables
- Use `echo $VARIABLE_NAME` to debug

### Payment Issues

- Verify Pi API key is for production
- Check CORS configuration
- Review payment logs
- Verify wallet address is correct

## Rollback

If you need to rollback to a previous version:

1. Go to Vercel Deployments
2. Select the previous deployment
3. Click "Promote to Production"

## Scaling

### API Rate Limiting

Implement rate limiting for API endpoints:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Database Optimization

- Add proper indexes
- Implement caching
- Use connection pooling

## Security

- [ ] Rotate JWT secret periodically
- [ ] Keep dependencies updated
- [ ] Monitor for vulnerabilities
- [ ] Use HTTPS everywhere
- [ ] Implement CSRF protection
- [ ] Validate all inputs
- [ ] Store sensitive data securely

## Support

For issues:
1. Check Vercel documentation
2. Review Pi Network documentation
3. Check project GitHub issues
4. Contact support team
