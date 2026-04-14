import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  if (path.startsWith('/dashboard') || path.startsWith('/admin')) {
    const token = request.cookies.get('admagic_session')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    const payload = await verifyToken(token);
    
    if (!payload) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Role-based protection for /admin
    if (path.startsWith('/admin') && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (path.startsWith('/auth')) {
    const token = request.cookies.get('admagic_session')?.value;
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        // Redirect based on role
        const target = payload.role === 'ADMIN' ? '/admin' : '/dashboard';
        return NextResponse.redirect(new URL(target, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/auth/:path*'],
};
