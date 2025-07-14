import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './config/i18n';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: false, // Disabled to prevent automatic redirects
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow root path to serve content without redirect
  if (pathname === '/') {
    return;
  }
  
  // For all other paths, use next-intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - ... if they start with `/api`, `/_next` or `/_vercel`
  // - ... the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};