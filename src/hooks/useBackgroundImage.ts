import { useState, useEffect } from 'react';
import { fetchBackgroundImage } from '@/api/appImages';

export const useBackgroundImage = () => {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBackgroundImage = async () => {
      try {
        setLoading(true);
        const imageUrl = await fetchBackgroundImage();
        setBackgroundImageUrl(imageUrl);
        
        // CSS 변수 업데이트
        if (imageUrl) {
          document.documentElement.style.setProperty('--background-image-url', `url('${imageUrl}')`);
        }
      } catch (error) {
        console.error('배경 이미지 로드 실패:', error);
        // 기본값 사용
        setBackgroundImageUrl('https://smoemdfpvkatezrsrttu.supabase.co/storage/v1/object/public/kin/images/background.jpg');
      } finally {
        setLoading(false);
      }
    };

    loadBackgroundImage();
  }, []);

  const updateBackgroundImage = (newImageUrl: string) => {
    setBackgroundImageUrl(newImageUrl);
    document.documentElement.style.setProperty('--background-image-url', `url('${newImageUrl}')`);
  };

  return {
    backgroundImageUrl,
    loading,
    updateBackgroundImage
  };
}; 