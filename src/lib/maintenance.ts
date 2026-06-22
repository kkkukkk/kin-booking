const CACHE_TTL_MS = 30_000;

let maintenanceCache: { value: boolean; expiresAt: number } | null = null;

const getSupabaseEnv = () => {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !anonKey) return null;
	return { url, anonKey };
};

/** 비상 차단: Vercel env MAINTENANCE_FORCE=true */
export const isMaintenanceForceEnabled = () => process.env.MAINTENANCE_FORCE === 'true';

export const fetchSiteMaintenanceEnabledFromDb = async (): Promise<boolean> => {
	const env = getSupabaseEnv();
	if (!env) return false;

	const response = await fetch(`${env.url}/rest/v1/rpc/get_site_maintenance_mode`, {
		method: 'POST',
		headers: {
			apikey: env.anonKey,
			Authorization: `Bearer ${env.anonKey}`,
			'Content-Type': 'application/json',
		},
		body: '{}',
		cache: 'no-store',
	});

	if (!response.ok) {
		console.error('[maintenance] RPC failed:', response.status, await response.text());
		return false;
	}

	const result: unknown = await response.json();
	return result === true;
};

export const isSiteMaintenanceEnabled = async (): Promise<boolean> => {
	if (isMaintenanceForceEnabled()) return true;

	const now = Date.now();
	if (maintenanceCache && maintenanceCache.expiresAt > now) {
		return maintenanceCache.value;
	}

	try {
		const value = await fetchSiteMaintenanceEnabledFromDb();
		maintenanceCache = { value, expiresAt: now + CACHE_TTL_MS };
		return value;
	} catch (error) {
		console.error('[maintenance] fetch failed:', error);
		return false;
	}
};
