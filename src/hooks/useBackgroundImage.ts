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
        } else {
          const fallbackUrl = 'https://smoemdfpvkatezrsrttu.supabase.co/storage/v1/object/public/kin/images/background.jpg';
          document.documentElement.style.setProperty('--background-image-url', `url('${fallbackUrl}')`);
        }
      } catch (error) {
        console.error('배경 이미지 로드 실패:', error);
        // 기본값 사용
        const fallbackUrl = 'https://smoemdfpvkatezrsrttu.supabase.co/storage/v1/object/public/kin/images/background.jpg';
        setBackgroundImageUrl(fallbackUrl);
        document.documentElement.style.setProperty('--background-image-url', `url('${fallbackUrl}')`);
      } finally {
        setLoading(false);
      }
    };

    // 즉시 실행
    loadBackgroundImage();
  }, []); // 빈 의존성 배열로 컴포넌트 마운트 시 한 번만 실행

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