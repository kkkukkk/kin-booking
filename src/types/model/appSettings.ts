export interface AppSettings {
	id: string;
	key: AppSettingKey;
	value: string;
	description?: string | null;
	createdAt: string;
	updatedAt: string;
}

export const AppSettingKeys = {
	SITE_MAINTENANCE: 'site_maintenance',
	BACKGROUND_IMAGE_URL: 'background_image_url',
} as const;

export type AppSettingKey = (typeof AppSettingKeys)[keyof typeof AppSettingKeys];

export interface LoginImage {
	id: string;
	url: string;
	order: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}
