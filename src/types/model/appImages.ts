export interface AppImage {
  id: string;
  type: 'background' | 'login_slide' | 'banner';
  url: string;
  order: number;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackgroundImage extends Omit<AppImage, 'type' | 'order' | 'isActive'> {
  type: 'background';
}

export interface LoginSlideImage extends Omit<AppImage, 'type'> {
  type: 'login_slide';
} 