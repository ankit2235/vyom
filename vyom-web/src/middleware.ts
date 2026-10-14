import { NextResponse, type NextRequest } from 'next/server';
import {
  AUTH_COOKIE,
  ROLE_COOKIE,
  TENANT_COOKIE,
  isOpsPath,
  isPublicPath,
  tenantSlugFromHost,
  tenantSlugFromPath,
} from '@/lib/auth/session';

/**
 * Edge gateway: marketing routes pass through; /ops and /[tenant_slug]
 * require a session. Tenant routes also receive `x-tenant-id`.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', pathname);

  if (isOpsPath(pathname)) {
    if (!token) {
      return NextResponse.redirect(loginUrl);
    }
    const role = request.cookies.get(ROLE_COOKIE)?.value;
    if (role !== 'internal_auditor') {
      const home = new URL('/', request.url);
      return NextResponse.redirect(home);
    }
    return NextResponse.next();
  }

  const host = request.headers.get('host') ?? '';
  const fromHost = tenantSlugFromHost(host, process.env.NEXT_PUBLIC_ROOT_DOMAIN);
  const fromPath = tenantSlugFromPath(pathname);
  const tenantSlug = fromHost ?? fromPath;

  if (!tenantSlug) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant-id', tenantSlug);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set('x-tenant-id', tenantSlug);

  const cookieTenant = request.cookies.get(TENANT_COOKIE)?.value;
  if (cookieTenant !== tenantSlug) {
    response.cookies.set(TENANT_COOKIE, tenantSlug, {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
