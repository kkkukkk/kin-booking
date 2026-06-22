import { fetchSiteMaintenanceValueRest } from '@/api/siteMaintenance';

const CACHE_TTL_MS = 30_000;

let maintenanceCache: { value: boolean; expiresAt: number } | null = null;

/** 비상 차단: Vercel env MAINTENANCE_FORCE=true */
export const isMaintenanceForceEnabled = () => process.env.MAINTENANCE_FORCE === 'true';

export const isSiteMaintenanceEnabled = async (): Promise<boolean> => {
	if (isMaintenanceForceEnabled()) return true;

	const now = Date.now();
	if (maintenanceCache && maintenanceCache.expiresAt > now) {
		return maintenanceCache.value;
	}

	try {
		const value = await fetchSiteMaintenanceValueRest();
		maintenanceCache = { value, expiresAt: now + CACHE_TTL_MS };
		return value;
	} catch (error) {
		console.error('[maintenance] fetch failed:', error);
		return false;
	}
};
