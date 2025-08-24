import { useState } from 'react';
import { uploadImageToStorage } from '@/api/appImages';
import useToast from '@/hooks/useToast';

interface UseImageUploadOptions {
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}

export default function useImageUpload(options: UseImageUploadOptions = {}) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { showToast } = useToast();

  const uploadImage = async (file: File, type: 'background' | 'login_slide' | 'banner'): Promise<string | null> => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // 파일 타입 검증
      if (!file.type.startsWith('image/')) {
        showToast({ message: '이미지 파일만 업로드 가능합니다.', iconType: 'error', autoCloseTime: 3000 });
        return null;
      }

      // 파일 크기 검증 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        showToast({ message: '파일 크기는 5MB 이하여야 합니다.', iconType: 'error', autoCloseTime: 3000 });
        return null;
      }

      // 업로드 진행률 시뮬레이션 (실제로는 Supabase에서 제공하지 않음)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // API를 통한 업로드
      const imageUrl = await uploadImageToStorage(file, type);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // 성공 처리
      showToast({ message: '이미지가 업로드되었습니다.', iconType: 'success', autoCloseTime: 3000 });
      options.onSuccess?.(imageUrl);
      
      return imageUrl;
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      showToast({ message: `이미지 업로드에 실패했습니다: ${errorMessage}`, iconType: 'error', autoCloseTime: 3000 });
      options.onError?.(error instanceof Error ? error : new Error(errorMessage));
      return null;
    } finally {
      setUploading(false);
      // 진행률을 잠시 유지한 후 리셋
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const resetProgress = () => {
    setUploadProgress(0);
  };

  return {
    uploading,
    uploadProgress,
    uploadImage,
    resetProgress
  };
} 