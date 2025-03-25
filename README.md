# Juno Faucet

A Next.js application that allows users to request testnet tokens (JUNOx) for the Juno Network blockchain through GitHub authentication.

## Features

- GitHub authentication
- Rate limiting (12-hour cooldown between token requests)
- Cosmos SDK integration for token distribution
- Redis for storing user request timestamps
- Responsive UI built with Tailwind CSS
- TypeScript for type safety

## Prerequisites

- Node.js 18+ and npm/yarn
- Redis instance (local or remote)
- GitHub OAuth application
- Juno testnet wallet with mnemonic

## Configuration

The application uses environment variables for configuration. Create a `.env.local` file in the root directory with the following variables:

```
# Next Auth
# You can generate a new secret on the command line with:
# openssl rand -base64 32
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# GitHub OAuth
# Create a GitHub OAuth app at: https://github.com/settings/developers
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Redis (for rate limiting)
REDIS_URL=redis://localhost:6379

# Blockchain Configuration
CHAIN_PREFIX=juno
CHAIN_DENOM=ujunox
CHAIN_RPC=https://rpc-uni.junonetwork.io
DISPOSING_AMOUNT=50000000 # 50 JUNOx (1 JUNOx = 1,000,000 ujunox)

# Faucet Wallet
FAUCET_MNEMONIC="your mnemonic phrase here"
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/juno-faucet.git
cd juno-faucet
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000.

## Development

The project is built with Next.js 15 and uses the App Router pattern. Key directories include:

- `/app`: Main application routes and API endpoints
- `/components`: Reusable UI components
- `/lib`: Utility functions and shared code

### API Routes

- `/api/auth/[...nextauth]`: Authentication endpoints
- `/api/faucet`: Token distribution endpoint

### Key Components

- `FaucetForm`: The main form component for requesting tokens
- `SignIn`/`SignOut`: Authentication-related components

## Building for Production

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## Deployment

This application can be deployed to platforms like Vercel, Netlify, or any other hosting service that supports Next.js applications.

### Vercel Deployment

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Configure the environment variables in the Vercel dashboard
4. Deploy

### Docker Deployment

A `Dockerfile` and `docker-compose.yml` can be created for containerized deployment. Example:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## Maintenance

### Funding the Faucet

The faucet wallet needs to be funded periodically with testnet tokens. Monitor the balance to ensure it doesn't run out of funds.

### Rate Limiting

The default cooldown period is 12 hours (43200000 milliseconds). This can be adjusted in the faucet API route.

## Troubleshooting

Common issues:

- **Authentication Errors**: Ensure your GitHub OAuth credentials are correct and the callback URL is properly configured.
- **Redis Connection Issues**: Verify your Redis connection string and ensure the Redis server is running.
- **Faucet Out of Funds**: If users report errors, check the faucet wallet balance and refill if necessary.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
