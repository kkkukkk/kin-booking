import { AppSettingKeys } from '@/types/model/appSettings';

export type SiteMaintenanceKey = typeof AppSettingKeys.SITE_MAINTENANCE;

export type SiteMaintenanceValue = 'true' | 'false';

export const SITE_MAINTENANCE_KEY = AppSettingKeys.SITE_MAINTENANCE;

export const SITE_MAINTENANCE_DESCRIPTION =
	'사이트 점검 모드. true면 일반 사용자는 /maintenance로 이동합니다.';

export const toSiteMaintenanceEnabled = (value: string | null | undefined): boolean => value === 'true';

export const toSiteMaintenanceValue = (enabled: boolean): SiteMaintenanceValue =>
	enabled ? 'true' : 'false';
