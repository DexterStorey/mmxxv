# MMXXV

A prediction market game for 2025. Players create markets, make predictions, and compete for points based on their forecasting accuracy.

## Tech Stack

- **Frontend**
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Framer Motion for animations
  - Radix UI primitives
  - Lucide Icons

- **Backend**
  - Prisma ORM
  - PostgreSQL
  - tRPC for type-safe APIs
  - Clerk for authentication

- **Infrastructure**
  - Vercel for deployment
  - PlanetScale for database
  - Upstash for Redis caching
  - GitHub Actions for CI/CD

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Bun](https://bun.sh) for package management
- [Git](https://git-scm.com/)
- [PostgreSQL](https://www.postgresql.org/) (local development)
- A code editor (we recommend [Cursor](https://cursor.sh))

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/RubricLab/mmxxv.git
   cd mmxxv
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   - Request access to the `.env` file by emailing dexter@dexterstorey.com with subject: "URGENT ACCESS: MMXXV Dev Setup"
   - Place the received `.env` file in the project root
   - Required variables include:
     ```plaintext
     DATABASE_URL=
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
     CLERK_SECRET_KEY=
     UPSTASH_REDIS_REST_URL=
     UPSTASH_REDIS_REST_TOKEN=
     ```

4. Initialize the database:
   ```bash
   bun prisma generate
   bun prisma db push
   ```

5. Start the development server:
   ```bash
   bun dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable UI components
├── lib/                 # Utility functions and shared logic
│   ├── actions/        # Server actions
│   ├── api/            # API routes
│   └── hooks/          # Custom React hooks
├── prisma/             # Database schema and migrations
├── public/             # Static assets
└── styles/             # Global styles and Tailwind config
```

## Development Guidelines

### Code Style

- We use ESLint and Prettier for code formatting
- Run `bun lint` before committing
- Follow the TypeScript strict mode guidelines
- Use meaningful commit messages following [Conventional Commits](https://www.conventionalcommits.org/)

### Component Guidelines

- Use TypeScript interfaces for prop definitions
- Implement proper error boundaries
- Follow atomic design principles
- Write unit tests for critical components

### Performance Considerations

- Implement proper loading states
- Use React Suspense boundaries
- Optimize images and assets
- Follow Next.js best practices for routing and data fetching

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Pull Request Guidelines

- Ensure all tests pass
- Update documentation as needed
- Add tests for new features
- Follow the existing code style
- Keep changes focused and atomic

## Game Rules

For detailed information about how the game works, please visit the [About page](https://mmxxv.com/about) after setting up the project.

## License

This project is open source and available under the MIT license.

## Support

If you encounter any issues or need help with development:
- Open a GitHub issue
- Join our [Discord community](https://discord.gg/mmxxv)
- Check our [Documentation](https://docs.mmxxv.com)
   
   
