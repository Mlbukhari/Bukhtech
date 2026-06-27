# Environment Configuration Guide

## Overview

This guide explains how to configure environment variables for different environments.

## File Structure

```
.env                    # Local development (not committed)
.env.local             # Local overrides (not committed)
.env.example           # Template (committed)
.env.production        # Production config (use Vercel dashboard)
.env.test              # Test configuration
```

## Development Setup

### 1. Copy Example File

```bash
cp .env.example .env.local
```

### 2. Fill in Your Values

```env
# Pi Network (Testnet)
REACT_APP_PI_API_KEY=your_testnet_api_key
REACT_APP_PI_WALLET_ADDRESS=your_testnet_wallet
REACT_APP_PI_APP_ID=your_testnet_app_id
REACT_APP_PI_ENVIRONMENT=testnet

# Backend
BACKEND_PORT=5000
NODE_ENV=development
JWT_SECRET=dev-secret-key-change-in-production

# API
REACT_APP_API_URL=http://localhost:5000
```

### 3. Start Development Server

```bash
npm run dev
```

## Environment Variables

### Frontend Variables (REACT_APP_*)

These are exposed to the frontend and visible in browser:

#### Pi Network Configuration

| Variable | Description | Example |
|----------|-------------|----------|
| `REACT_APP_PI_API_KEY` | Pi Network API key | `abc123...` |
| `REACT_APP_PI_WALLET_ADDRESS` | Your Pi wallet address | `GxxxxxxxxxxxF` |
| `REACT_APP_PI_APP_ID` | Pi App ID | `app_id_xxx` |
| `REACT_APP_PI_ENVIRONMENT` | testnet or mainnet | `testnet` |
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000` |

### Backend Variables

These are **private** and only accessible on the server:

| Variable | Description | Example |
|----------|-------------|----------|
| `NODE_ENV` | development, production | `development` |
| `BACKEND_PORT` | Server port | `5000` |
| `JWT_SECRET` | Secret for JWT signing | `super_secret_key` |
| `DATABASE_URL` | Database connection | (optional) |

## Testnet Configuration

For testing with Pi testnet:

```env
REACT_APP_PI_ENVIRONMENT=testnet
REACT_APP_PI_API_KEY=your_testnet_key
NODE_ENV=development
```

### Get Testnet Credentials

1. Visit [Pi Developer Portal](https://developers.pi-network.com)
2. Create a new app
3. Request testnet access
4. Generate API credentials
5. Copy to `.env.local`

## Mainnet Configuration

For production with Pi mainnet:

```env
REACT_APP_PI_ENVIRONMENT=mainnet
REACT_APP_PI_API_KEY=your_mainnet_key
NODE_ENV=production
JWT_SECRET=strong_production_secret
```

### Get Mainnet Credentials

1. Complete Pi KYC verification
2. Apply for mainnet access
3. Generate production API credentials
4. Add to Vercel environment variables

## Vercel Environment Variables

### Setting Variables

1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add variables for each environment:

#### Production

```
REACT_APP_PI_ENVIRONMENT=mainnet
REACT_APP_PI_API_KEY=<mainnet_key>
JWT_SECRET=<production_secret>
```

#### Preview (Pull Requests)

```
REACT_APP_PI_ENVIRONMENT=testnet
REACT_APP_PI_API_KEY=<testnet_key>
```

#### Development

```
REACT_APP_PI_ENVIRONMENT=testnet
REACT_APP_API_URL=http://localhost:5000
```

## Security Best Practices

### DO

- ✅ Use strong, random JWT secrets
- ✅ Rotate secrets regularly
- ✅ Keep `.env` files out of git
- ✅ Use different keys for each environment
- ✅ Store secrets in Vercel dashboard
- ✅ Never commit `.env` files

### DON'T

- ❌ Commit `.env` files to git
- ❌ Use same secret in all environments
- ❌ Hardcode credentials in code
- ❌ Share environment files
- ❌ Use weak secrets
- ❌ Log sensitive data

## Validating Configuration

### Test Environment

```bash
# Check if variables are set
echo $REACT_APP_PI_API_KEY

# Test API connection
curl http://localhost:5000/api/health

# Run tests
npm test
```

### Health Check

```bash
# Local
curl http://localhost:5000/api/health

# Production
curl https://your-domain.com/api/health
```

## Switching Environments

### For Testing

```bash
# Use testnet
REACT_APP_PI_ENVIRONMENT=testnet npm start

# Use mainnet (with mainnet credentials)
REACT_APP_PI_ENVIRONMENT=mainnet npm start
```

### For Deployment

Vercel automatically uses the correct environment variables based on the deployment type (production, preview, development).

## Troubleshooting

### Variables Not Loading

1. Restart development server: `npm run dev`
2. Check variable names (must start with REACT_APP_)
3. Verify `.env.local` file exists
4. Check for typos in variable names

### Wrong Environment

1. Verify REACT_APP_PI_ENVIRONMENT value
2. Check you're using correct API keys
3. Review Vercel environment settings

### Authentication Failing

1. Verify JWT_SECRET is set
2. Check API key is valid
3. Confirm Pi environment matches key type

## Reference

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Pi Network Docs](https://developers.pi-network.com/)
- [Create React App Env Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
