export interface CreateAppImageDto {
  type: 'background' | 'login_slide' | 'banner';
  url: string;
  order?: number;
  isActive?: boolean;
  description?: string;
}

export interface UpdateAppImageDto {
  url?: string;
  order?: number;
  isActive?: boolean;
  description?: string;
}

export interface AppImageDto {
  id: string;
  type: 'background' | 'login_slide' | 'banner';
  url: string;
  order: number;
  isActive: boolean;
  description?: string;
} 