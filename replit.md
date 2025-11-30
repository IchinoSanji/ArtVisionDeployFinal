# ArtVision - AI Art Analysis Platform

## Overview

ArtVision is an AI-powered art analysis application that allows users to upload artwork images and receive detailed analysis including artistic style, probable artist, historical period, and AI-generated descriptions. The platform features a conversational chat interface where users can engage with an AI art curator to learn about art history and discuss uploaded works.

The application is built as a full-stack monorepo with a React frontend using shadcn/ui components and an Express backend with Google Gemini AI integration for image analysis and conversational responses.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript as the core UI framework
- Vite as the build tool and development server
- Wouter for lightweight client-side routing (alternative to React Router)

**UI Component System:**
- shadcn/ui component library with Radix UI primitives
- Tailwind CSS with custom theming (dark museum aesthetic by default)
- Custom fonts: Inter for sans-serif, Playfair Display for serif
- Framer Motion for animations and transitions

**State Management:**
- Simple in-memory store using React hooks and event listeners (no Redux/Zustand)
- TanStack Query (React Query) for server state management and API calls
- Local state stored in `client/src/lib/store.ts` with analysis results and chat messages

**Key Design Decisions:**
- Museum-inspired dark theme as default aesthetic
- Conversational chat interface as primary interaction pattern
- Image upload via drag-and-drop, file input, or camera capture
- Analysis results displayed in dedicated result pages with shareable URLs

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript running on Node.js
- HTTP server created via `createServer` from Node's http module
- Development mode uses Vite middleware for HMR
- Production builds to single CommonJS file via esbuild

**API Design:**
- RESTful endpoints under `/api` prefix
- JSON request/response format with 50MB payload limit
- Session-based authentication using express-session
- Request logging middleware for all API calls

**AI Integration:**
- Google Gemini AI (`@google/genai`) as primary AI provider for:
  - Image analysis (style, artist, period identification)
  - Conversational chat responses with art history knowledge
  - AI-generated artwork descriptions
- System prompt defines AI persona as "ArtVision" art curator
- Maintains comprehensive knowledge base of art movements (Renaissance through Contemporary)

**Authentication System:**
- Replit OpenID Connect (OIDC) integration via Passport.js
- Session store backed by PostgreSQL (connect-pg-simple)
- JWT-style access tokens with refresh token support
- Session TTL of 7 days with HTTP-only, secure cookies

### Data Storage Solutions

**Database:**
- PostgreSQL as primary database
- Neon Serverless (`@neondatabase/serverless`) for connection pooling
- Drizzle ORM for type-safe database queries and migrations
- WebSocket connection mode for Neon compatibility

**Schema Design:**
- `users` table: Stores user profiles from OIDC authentication (id, email, names, profile image)
- `sessions` table: Stores express-session data with expiration
- Schema defined in `shared/schema.ts` and shared between client/server
- Drizzle Zod integration for runtime validation

**Migration Strategy:**
- Migrations output to `./migrations` directory
- Database schema changes via `npm run db:push` command
- Connection via `DATABASE_URL` environment variable

### External Dependencies

**AI Services:**
- Google Gemini API for image vision and text generation
- API key required via `GEMINI_API_KEY` environment variable
- OpenAI client included but not actively used (potential future integration)

**Authentication Provider:**
- Replit OIDC for user authentication
- Requires `REPL_ID`, `ISSUER_URL`, and `SESSION_SECRET` environment variables
- User profile data (email, name, avatar) automatically synced

**Database Service:**
- Neon Serverless PostgreSQL (or compatible PostgreSQL provider)
- Connection string via `DATABASE_URL` environment variable
- Supports both direct connections and WebSocket connections

**Development Tools:**
- Replit-specific Vite plugins for development experience:
  - `@replit/vite-plugin-cartographer` for code mapping
  - `@replit/vite-plugin-dev-banner` for development indicators
  - `@replit/vite-plugin-runtime-error-modal` for error overlay
- Custom `vite-plugin-meta-images` for OpenGraph image URL updates

**Asset Management:**
- Static assets served from `client/public` directory
- Custom attached assets directory at `attached_assets`
- Background textures and images referenced via Vite's asset import system

**Build & Deployment:**
- Separate build processes for client (Vite) and server (esbuild)
- Server dependencies bundled to reduce syscalls and improve cold starts
- Allowlist of critical dependencies to bundle (AI SDKs, database drivers, etc.)
- Production server runs compiled CommonJS output