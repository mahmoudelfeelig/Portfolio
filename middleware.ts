import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const canonicalHost = 'elfeel.me';

export function middleware(request: NextRequest) {
  const requestHost = request.headers.get('host')?.split(':')[0].toLowerCase();
  const destination = request.nextUrl.clone();

  if (request.nextUrl.pathname === '/:path*') {
    destination.protocol = 'https:';
    destination.hostname = canonicalHost;
    destination.port = '';
    destination.pathname = '/';

    return NextResponse.redirect(destination, 308);
  }

  if (requestHost !== `www.${canonicalHost}`) {
    return NextResponse.next();
  }

  destination.protocol = 'https:';
  destination.hostname = canonicalHost;
  destination.port = '';

  return NextResponse.redirect(destination, 308);
}

export const config = {
  matcher: '/:path*',
};
