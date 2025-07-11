# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server (localhost:3000)
- `npm run build` - Production build with environment variables for version/build time
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking without emitting files

### Testing & Quality
- Always run `npm run lint` and `npm run type-check` before committing changes
- The build command automatically sets `NEXT_PUBLIC_APP_VERSION` and `NEXT_PUBLIC_BUILD_TIME` environment variables

## Architecture Overview

### Framework & Structure
- **Next.js 14** with App Router (not Pages Router)
- **Progressive Web App (PWA)** with offline capability via service worker (`public/sw.js`)
- **TypeScript strict mode** with absolute imports using `@/` prefix
- **Real-time data polling** every 10 seconds with intelligent retry logic

### Key Architectural Patterns

#### Data Flow Architecture
- **Service Layer**: API calls abstracted in `src/services/pathApi.ts` with dual endpoint strategy (direct API + CORS proxy fallback)
- **Custom Hooks**: Data fetching through hooks like `useMultiStationData`, `useAlerts`, `useGeolocation`
- **Context Providers**: Global state managed via `ThemeContext` and `UserPreferencesContext`
- **Local Storage**: Persistent state with proper hydration patterns

#### Component Architecture
- **shadcn/ui components** in `src/components/ui/` (configured via `components.json`)
- **Feature components** co-located with related hooks and utilities
- **Compound component pattern** for complex UI interactions
- **Drag-and-drop** functionality using `@dnd-kit` library

### Critical Application Patterns

#### Real-time Data Management
- Multi-station tracking with persistent user preferences
- Optimistic updates with fallback to cached data
- No-cache fetch strategy (`cache: "no-store"`) for live data
- Graceful degradation when APIs unavailable

#### PWA Implementation
- Full offline capability with service worker
- App installation prompts with custom UI
- Standalone display mode for app-like experience
- Push notification infrastructure ready

#### API Error Handling
- Dual endpoint strategy in `pathApi.ts` (direct + proxy)
- User-friendly error messages mapped from HTTP status codes
- Automatic fallback between primary and proxy APIs

### Project-Specific Conventions

#### Import Strategy
- Use `@/` prefix for all internal imports
- Components imported from `@/components`
- Services from `@/services`, hooks from `@/hooks`, etc.

#### State Management
- React Context for global state (theme, user preferences)
- Local component state with useState/useEffect
- localStorage for persistence with hydration checks
- No external state management library (Redux, Zustand, etc.)

#### Styling Approach
- Tailwind CSS with CSS variables for theming
- Dark mode support throughout application
- Responsive design with mobile-first approach
- Framer Motion for animations

#### SEO & Analytics
- Comprehensive metadata in `layout.tsx` with structured data
- Multiple analytics providers: Vercel Analytics, OpenPanel, Plausible
- PWA-optimized meta tags and manifest configuration

### File Organization Principles
- App Router structure in `src/app/`
- Feature-based organization for components
- Type definitions centralized in `src/types/`
- Constants and configuration in respective directories
- Utility functions in `src/utils/` and shared library code in `src/lib/`

### API Integration Notes
- PATH train data from Port Authority NY & NJ public API
- CORS proxy fallback for reliability
- Real-time polling with intelligent backoff
- Location-based features using browser geolocation API

### Performance Optimizations
- SWC compiler for fast builds
- Console removal in production builds
- Service worker caching strategies
- Optimized bundle with Next.js 14 features