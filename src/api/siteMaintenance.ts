import { createAppSetting, fetchAppSettingByKey, updateAppSetting } from '@/api/appSettings';
import { AppSettingKeys, AppSettings } from '@/types/model/appSettings';
import {
	SITE_MAINTENANCE_DESCRIPTION,
	toSiteMaintenanceEnabled,
	toSiteMaintenanceValue,
} from '@/types/model/siteMaintenance';
import { toCamelCaseKeys } from '@/util/case/case';

const SITE_MAINTENANCE_KEY = AppSettingKeys.SITE_MAINTENANCE;

const getSupabaseRestEnv = () => {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !anonKey) return null;
	return { url, anonKey };
};

/** middleware/edge용 — Supabase REST 직접 조회 */
export const fetchSiteMaintenanceValueRest = async (): Promise<boolean> => {
	const env = getSupabaseRestEnv();
	if (!env) return false;

	const params = new URLSearchParams({
		select: 'value',
		key: `eq.${SITE_MAINTENANCE_KEY}`,
		limit: '1',
	});

	const response = await fetch(`${env.url}/rest/v1/app_settings?${params}`, {
		headers: {
			apikey: env.anonKey,
			Authorization: `Bearer ${env.anonKey}`,
		},
		cache: 'no-store',
	});

	if (!response.ok) {
		throw new Error(`[siteMaintenance] REST failed: ${response.status}`);
	}

	const rows = toCamelCaseKeys<Pick<AppSettings, 'value'>[]>(await response.json());
	return toSiteMaintenanceEnabled(rows[0]?.value);
};

/** 클라이언트/관리자용 — supabase-js (REST) 조회 */
export const fetchSiteMaintenanceEnabled = async (): Promise<boolean> => {
	const setting = await fetchAppSettingByKey(SITE_MAINTENANCE_KEY);
	return toSiteMaintenanceEnabled(setting?.value);
};

/** 클라이언트/관리자용 — supabase-js (REST) 저장 */
export const setSiteMaintenanceEnabled = async (enabled: boolean) => {
	const value = toSiteMaintenanceValue(enabled);
	const existing = await fetchAppSettingByKey(SITE_MAINTENANCE_KEY);

	if (existing) {
		return updateAppSetting(SITE_MAINTENANCE_KEY, {
			value,
			description: SITE_MAINTENANCE_DESCRIPTION,
		});
	}

	return createAppSetting({
		key: SITE_MAINTENANCE_KEY,
		value,
		description: SITE_MAINTENANCE_DESCRIPTION,
	});
};
