import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** 사이트 재오픈 시 false로 변경 */
const MAINTENANCE_ENABLED = true;

const MAINTENANCE_PATH = '/maintenance';

const isStaticAsset = (pathname: string) =>
	pathname.startsWith('/_next') ||
	pathname.startsWith('/fabicon') ||
	pathname.startsWith('/images') ||
	/\.(?:ico|png|jpg|jpeg|svg|gif|webp|json|txt|xml|woff2?)$/i.test(pathname);

export function middleware(request: NextRequest) {
	if (!MAINTENANCE_ENABLED) {
		return NextResponse.next();
	}

	const { pathname } = request.nextUrl;

	if (pathname === MAINTENANCE_PATH || isStaticAsset(pathname)) {
		return NextResponse.next();
	}

	return NextResponse.redirect(new URL(MAINTENANCE_PATH, request.url));
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
