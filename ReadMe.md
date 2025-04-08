# Introduction

## Overview

Continuum Block Tech is a full-stack application built with modern web technologies, featuring a robust backend service and a user-friendly frontend interface. The platform provides various features including authentication, file storage, and social integration.

## Getting Started

### Prerequisites

- Node.js >= 18.18.0
- pnpm package manager
- MongoDB (for local development)
- Redis

### Installation

1.Clone the repository:

```bash
git clone https://github.com/your-org/continuum-block.git
cd continuum-block
```

2.Install dependencies:

```bash
pnpm install
```

3.Set up environment variables (see Configuration section below)

4.Start the development servers:

```bash
# Start backend
cd apps/backend
pnpm dev

# Start frontend (in a new terminal)
cd apps/frontend
pnpm dev
```

### Authentication

The application uses Clerk for authentication. You'll need to set up the following environment variables:

- `CLERK_SECRET_KEY`: Your Clerk secret key
- `CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `JWT_SECRET`: Secret key for JWT token generation

### Social Authentication

- `GITHUB_CLIENT_ID`: The GitHub application's client ID.
- `GITHUB_CLIENT_SECRET`: The GitHub application's client secret.
- `GOOGLE_CLIENT_ID`: The Google application's client ID.
- `GOOGLE_CLIENT_SECRET`: The Google application's client secret.
- `TWITTER_CONSUMER_KEY`: The Twitter application's consumer key.
- `TWITTER_CONSUMER_SECRET`: The Twitter application's consumer secret.
- `SOCIAL_REDIRECT_URL`: The URL to redirect to after social authentication.

### File Storage

The application uses Cloudinary for file storage. Configure the following:

- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

### Database Configuration

- `MONGODB_URI`: MongoDB connection string (for local development)
- `REDIS_URL`: Redis connection URL

### Additional Config

- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3000)
- `CORS_ORIGIN`: Allowed CORS origins
- `STRIPE_SECRET_KEY`: Stripe API key for payments
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret

## Development

### Project Structure

continuum-block/
├── apps/
│   ├── backend/         # Backend service
│   └── frontend/        # Frontend application
|   |__ mobile
├── packages/            # Shared packages
└── pnpm-workspace.yaml  # Workspace configuration

### Available Scripts

- `pnpm install`: Install all dependencies
- `pnpm dev`: Start development servers
- `pnpm build`: Build all packages
- `pnpm test`: Run tests
- `pnpm lint`: Run linter

## Contribution

    <!-- "dynamodb": "java -Djava.library.path=C:/dynamodb-local/DynamoDBLocal_lib -jar C:/dynamodb-local/DynamoDBLocal.jar -sharedDb -dbPath ./dynamodb-data", -->

### Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use meaningful commit messages
- Write tests for new features
- Update documentation as needed

### Testing

Run the test suite:

```bash
pnpm test
```

### Linting

Ensure code quality:

```bash
pnpm lint
```

## License

This project is licensed under the ISC License.
