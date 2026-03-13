import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Allow home page, faqs, privacy, and static files
  if (pathname !== '/' && 
      pathname !== '/faqs' && 
      pathname !== '/privacy' && 
      !pathname.startsWith('/_next') && 
      !pathname.startsWith('/api') && 
      !pathname.startsWith('/logo.png') && 
      !pathname.includes('.')) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
