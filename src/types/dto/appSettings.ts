export interface CreateAppSettingsDto {
  key: string;
  value: string;
  description?: string;
}

export interface UpdateAppSettingsDto {
  value: string;
  description?: string;
}

// 로그인 이미지 관련 DTO
export interface LoginImageDto {
  id: string;
  url: string;
  order: number;
  isActive: boolean;
}

export interface CreateLoginImageDto {
  url: string;
  order: number;
  isActive?: boolean;
}

export interface UpdateLoginImageDto {
  url?: string;
  order?: number;
  isActive?: boolean;
} 