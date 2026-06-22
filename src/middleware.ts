import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isSiteMaintenanceEnabled } from '@/lib/maintenance';

const MAINTENANCE_PATH = '/maintenance';

const isStaticAsset = (pathname: string) =>
	pathname.startsWith('/_next') ||
	pathname.startsWith('/fabicon') ||
	pathname.startsWith('/images') ||
	/\.(?:ico|png|jpg|jpeg|svg|gif|webp|json|txt|xml|woff2?)$/i.test(pathname);

const isMaintenanceBypass = (pathname: string) =>
	pathname === MAINTENANCE_PATH ||
	pathname.startsWith('/admin') ||
	pathname === '/login' ||
	pathname.startsWith('/auth') ||
	isStaticAsset(pathname);

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const maintenanceEnabled = await isSiteMaintenanceEnabled();
	if (maintenanceEnabled && !isMaintenanceBypass(pathname)) {
		return NextResponse.redirect(new URL(MAINTENANCE_PATH, request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
