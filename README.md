# Bukhtech - Pi Network Marketplace dApp

A production-ready marketplace application built for the Pi Network blockchain ecosystem. This dApp is fully compatible with the Pi Browser and Pi App Studio, featuring Pi Authentication, Pi Payments, and a complete vendor dashboard.

## Features

✅ **Pi SDK Integration**
- Complete Pi Authentication flow
- Pi Payments with Testnet & Mainnet support
- Server-side signature verification
- Secure payment flow

✅ **Complete Payment Flow**
- Create Payment API
- User Authentication (Sign in with Pi)
- Vendor Dashboard
- Server Approval System
- Payment Completion & Verification

✅ **Production Ready**
- Deployed on Vercel Serverless Functions
- CORS configured for Pi Browser compatibility
- Environment-based configuration (Testnet/Mainnet)
- Error handling & logging
- Security best practices

## Tech Stack

- **Frontend**: React 18, React Router
- **Backend**: Node.js with Express
- **Serverless**: Vercel Functions
- **Authentication**: Pi SDK
- **Payments**: Pi Network Payments API
- **Environment**: Node.js 18+

## Project Structure

```
bukhtech/
├── public/                    # Static assets
├── src/
│   ├── components/           # React components
│   │   ├── Layout/          # Main layout wrapper
│   │   ├── Auth/            # Authentication components
│   │   ├── Marketplace/     # Marketplace components
│   │   └── Vendor/          # Vendor dashboard
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API service layer
│   ├── utils/               # Utility functions
│   ├── styles/              # CSS modules
│   └── App.js              # Main app entry
├── api/                      # Vercel serverless functions
│   ├── auth/               # Authentication endpoints
│   ├── payments/           # Payment endpoints
│   ├── vendors/            # Vendor endpoints
│   └── utils/              # Backend utilities
├── config/                   # Configuration files
└── docs/                     # Documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Pi Network account (Testnet)
- Pi API credentials

### Installation

```bash
# Clone the repository
git clone https://github.com/Mlbukhari/Bukhtech.git
cd Bukhtech

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your Pi Network credentials
```

### Running Locally

```bash
# Development mode (runs frontend and API concurrently)
npm run dev

# Frontend only (http://localhost:3000)
npm run dev:frontend

# API only (http://localhost:5000)
npm run dev:api

# Production build
npm run build
```

## Pi Network Integration

### Authentication Flow

1. User clicks "Sign in with Pi"
2. Pi SDK redirects to authentication
3. User grants permissions
4. Backend verifies authentication token
5. User session created

### Payment Flow

1. User initiates payment from marketplace
2. Frontend calls `/api/payments/create` with payment details
3. Backend creates payment via Pi API (Testnet/Mainnet)
4. Pi SDK displays payment approval UI
5. User approves transaction
6. Backend receives callback and verifies signature
7. Payment marked as complete
8. Frontend receives confirmation

## Environment Configuration

### Testnet (Development)

```env
REACT_APP_PI_ENVIRONMENT=testnet
REACT_APP_PI_API_KEY=your_testnet_key
```

### Mainnet (Production)

```env
REACT_APP_PI_ENVIRONMENT=mainnet
REACT_APP_PI_API_KEY=your_mainnet_key
```

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in with Pi
- `POST /api/auth/verify` - Verify authentication token
- `POST /api/auth/signout` - Sign out user

### Payments
- `POST /api/payments/create` - Create new payment
- `POST /api/payments/approve` - Approve payment
- `POST /api/payments/complete` - Mark payment as complete
- `GET /api/payments/:id` - Get payment details

### Vendors
- `GET /api/vendors/dashboard` - Get vendor dashboard data
- `POST /api/vendors/register` - Register as vendor
- `GET /api/vendors/:id/sales` - Get vendor sales

## Deployment

### Vercel Deployment

1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy (automatic on push to main)

```bash
# Deploy command
vercel deploy
```

### Environment Variables (Vercel)

Set these in Vercel project settings:
- `REACT_APP_PI_API_KEY`
- `REACT_APP_PI_WALLET_ADDRESS`
- `REACT_APP_PI_APP_ID`
- `REACT_APP_PI_ENVIRONMENT`
- `VERCEL_URL`

## Pi Browser Compatibility

This dApp is optimized for:
- Pi Browser (iOS/Android)
- Pi App Studio
- Standard web browsers

### Features
- Responsive design
- Touch-optimized UI
- Pi SDK integration
- Native Pi authentication
- Secure payment handling

## Security Considerations

✅ **Implemented**
- Server-side signature verification
- HTTPS/TLS enforcement
- CORS configuration
- Environment variable security
- Input validation
- Rate limiting
- Secure session management

## Testing

```bash
# Run tests
npm test

# Test payment flow (manual)
1. Sign in with Pi
2. Create test payment
3. Approve in Pi payment UI
4. Verify completion
```

## Troubleshooting

### Payment Creation Fails
- Check Pi API key is valid
- Verify Pi environment (testnet/mainnet) matches
- Check server logs for API errors

### Authentication Issues
- Ensure Pi App ID is correct
- Check CORS settings
- Verify session storage

### Vercel Deployment Issues
- Check environment variables are set
- Verify build command succeeds
- Check function logs in Vercel dashboard

## Support & Documentation

- [Pi Network Documentation](https://developers.pi-network.com/)
- [Pi SDK Documentation](https://pi-sdk-docs.pi-network.com/)
- [Vercel Documentation](https://vercel.com/docs)

## License

MIT

## Author

Built by [Mlbukhari](https://github.com/Mlbukhari)
