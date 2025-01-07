# MMXXV

A prediction market game for 2025. Players create markets, make predictions, and compete for points based on their forecasting accuracy.

## Tech Stack

- **Frontend**
  - Next.js 15 (App Router)
  - TypeScript
  - Vanilla CSS with CSS Variables
  - @rubriclab/ui components
  - @rubriclab/auth for authentication

- **Backend**
  - Prisma ORM with PostgreSQL
  - Next.js Server Actions
  - Resend for email notifications

- **Infrastructure**
  - [Vercel](https://vercel.com) for deployment
  - [Neon](https://neon.tech) for PostgreSQL database
  - [Resend](https://resend.com) for transactional emails
  - Biome for code formatting

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Bun](https://bun.sh) for package management
- [Git](https://github.com/)
- A code editor (we recommend [Cursor](https://cursor.sh))

### Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

```bash
# App
URL                 # Base URL of the application (e.g., http://localhost:3000 for development)

# Database
DATABASE_URL        # PostgreSQL connection string from Neon (https://neon.tech)

# Email
RESEND_API_KEY     # API key from Resend.com for sending emails
```

#### Service Setup

1. **Database**: 
   - Create a new project on [Neon](https://neon.tech)
   - Copy the connection string from the dashboard
   - Make sure to append `?sslmode=require` to the connection string

2. **Email**:
   - Create an account on [Resend](https://resend.com)
   - Get your API key from the dashboard
   - Verify your domain for production use

3. **Deployment**:
   - We recommend [Vercel](https://vercel.com) for deployment
   - Connect your GitHub repository
   - Add the environment variables in Vercel's dashboard

You can also request access to a pre-configured `.env` file by emailing dexter@dexterstorey.com with subject: "URGENT ACCESS: MMXXV Dev Setup"

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
   - Copy `.env.example` to `.env`
   - Configure the variables as described above

4. Initialize the database:
   ```bash
   bun db:generate
   bun db:push
   ```

5. Start the development server:
   ```bash
   bun dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### NixOS

Installing dependencies (`bun install`) fails because prisma [doesn't release precompiled engine files for NixOS](https://www.prisma.io/docs/orm/more/under-the-hood/engines#using-custom-engine-libraries-or-binaries). Instead you can use [a flake](https://github.com/prisma/prisma/issues/3026#issuecomment-927258138) to let nix install the prisma engines which are then accessed via environment variables.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── lib/
│   ├── actions/        # Server actions
│   ├── components/     # React components
│   ├── services/      # Service layer
│   └── utils/         # Utility functions
└── schema/            # Prisma schema
```

## Development Guidelines

### Code Style

- We use Biome for code formatting and linting
- Run `bun lint` to check for issues
- Run `bun lint:fix` to automatically fix issues
- Run `bun format` to format code

### Database Management

- `bun db:push` - Push schema changes to database
- `bun db:generate` - Generate Prisma client
- `bun db:studio` - Open Prisma Studio

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Game Rules

For detailed information about how the game works, please visit the [About page](https://mmxxv.com/about) after setting up the project.

## Support

If you encounter any issues or need help with development:
- Open a GitHub issue
- Join our [Discord community](https://discord.gg/ndC6qaQC)

## License

This project is licensed under "go nuts" - see the package.json file for details.
