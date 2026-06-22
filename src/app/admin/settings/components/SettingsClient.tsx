'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { fetchImagesByType, updateImage, createImage } from '@/api/appImages';
import { AppImage } from '@/types/model/appImages';
import { CreateAppImageDto } from '@/types/dto/appImages';
import Button from '@/components/base/Button';
import Input from '@/components/base/Input';
import Textarea from '@/components/base/Textarea';
import useToast from '@/hooks/useToast';
import useImageUpload from '@/hooks/useImageUpload';
import LoginImagesManager from './LoginImagesManager';
import MaintenanceModeManager from './MaintenanceModeManager';
import Spinner from '@/components/spinner/Spinner';
import ThemeDiv from '@/components/base/ThemeDiv';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';

export default function SettingsClient() {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const [backgroundImage, setBackgroundImage] = useState<AppImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingBackground, setEditingBackground] = useState(false);
  const [editForm, setEditForm] = useState<CreateAppImageDto>({
    type: 'background',
    url: '',
    description: '메인 페이지 배경 이미지'
  });
  const [activeTab, setActiveTab] = useState<'maintenance' | 'background' | 'login-images'>('maintenance');
  const { showToast } = useToast();
  const { uploading, uploadProgress, uploadImage } = useImageUpload({
    onSuccess: (url) => {
      // 업로드 성공 시 URL을 폼에 설정
      setEditForm(prev => ({ ...prev, url }));
    }
  });

  const loadBackgroundImage = useCallback(async () => {
    try {
      setLoading(true);
      const images = await fetchImagesByType('background');
      if (images.length > 0) {
        setBackgroundImage(images[0]);
        setEditForm(prev => ({ ...prev, url: images[0].url }));
      }
    } catch (error) {
      console.error('배경 이미지 로드 실패:', error);
      showToast({ message: '배경 이미지를 불러오는데 실패했습니다.', iconType: 'error', autoCloseTime: 3000 });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadBackgroundImage();
  }, [loadBackgroundImage]);

  const handleEdit = () => {
    setEditingBackground(true);
  };

  const handleSave = async () => {
    try {
      if (backgroundImage) {
        await updateImage(backgroundImage.id, {
          url: editForm.url,
          description: editForm.description
        });
        showToast({ message: '배경 이미지가 업데이트되었습니다.', iconType: 'success', autoCloseTime: 3000 });
      } else {
        await createImage(editForm);
        showToast({ message: '새 배경 이미지가 생성되었습니다.', iconType: 'success', autoCloseTime: 3000 });
      }

      setEditingBackground(false);
      await loadBackgroundImage();
    } catch (error) {
      console.error('배경 이미지 저장 실패:', error);
      showToast({ message: '배경 이미지 저장에 실패했습니다.', iconType: 'error', autoCloseTime: 3000 });
    }
  };

  const handleCancel = () => {
    setEditingBackground(false);
    if (backgroundImage) {
      setEditForm(prev => ({ ...prev, url: backgroundImage.url }));
    }
  };



  // 파일 선택 핸들러
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadImage(file, 'background');
    } catch (error) {
      console.error('파일 업로드 실패:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size={80} color="var(--neon-green)" />
      </div>
    );
  }

  return (
    <ThemeDiv className="min-h-full space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--neon-green)] mb-4">설정</h1>
          <p className="text-gray-400">전역 설정과 이미지를 관리합니다.</p>
        </div>

        {/* 탭 네비게이션 */}
        <ThemeDiv className="flex space-x-1 rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'maintenance'
              ? 'bg-[var(--neon-green)] text-black'
              : 'text-gray-400 hover:text-gray-200'
              }`}
          >
            점검 모드
          </button>
          <button
            onClick={() => setActiveTab('background')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'background'
              ? 'bg-[var(--neon-green)] text-black'
              : 'text-gray-400 hover:text-gray-200'
              }`}
          >
            배경 이미지
          </button>
          <button
            onClick={() => setActiveTab('login-images')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'login-images'
              ? 'bg-[var(--neon-green)] text-black'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            로그인 슬라이드
          </button>
        </ThemeDiv>

        {activeTab === 'maintenance' ? <MaintenanceModeManager /> : null}

        {/* 배경 이미지 관리 */}
        {activeTab === 'background' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[var(--neon-green)]">메인 페이지 배경 이미지</h2>
              <Button
                onClick={handleEdit}
                theme={theme}
                className="font-semibold px-4 py-2"
              >
                {backgroundImage ? '수정' : '추가'}
              </Button>
            </div>

            {/* 현재 배경 이미지 표시 */}
            {backgroundImage ? (
              <ThemeDiv className="rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[var(--neon-green)] mb-4">현재 배경 이미지</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="relative w-full h-48">
                      <Image
                        src={backgroundImage.url}
                        alt="현재 배경 이미지"
                        fill
                        className="object-cover rounded"
                        onError={() => {
                          console.log('이미지 로드 실패:', backgroundImage?.url);
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        이미지 URL
                      </label>
                      <div className="text-gray-400 text-sm break-all">
                        {backgroundImage.url}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        설명
                      </label>
                      <div className="text-gray-400 text-sm">
                        {backgroundImage.description || '설명 없음'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        마지막 업데이트
                      </label>
                      <div className="text-gray-400 text-sm">
                        {new Date(backgroundImage.updatedAt).toLocaleString('ko-KR')}
                      </div>
                    </div>
                  </div>
                </div>
              </ThemeDiv>
            ) : null}

            {/* 배경 이미지 편집 폼 */}
            {editingBackground ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ThemeDiv className="rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[var(--neon-green)] mb-4">
                    {backgroundImage ? '배경 이미지 수정' : '새 배경 이미지 추가'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        이미지 업로드
                      </label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="background-image-upload"
                          disabled={uploading}
                        />
                        <label
                          htmlFor="background-image-upload"
                          className={`block w-full p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${uploading
                            ? 'border-gray-600 text-gray-500 cursor-not-allowed'
                            : 'border-gray-500 text-gray-400 hover:border-[var(--neon-green)] hover:text-[var(--neon-green)]'
                            }`}
                        >
                          {uploading ? (
                            <div className="space-y-3">
                              <Spinner size={32} color="var(--neon-green)" />
                              <div className="text-base">업로드 중...</div>
                              {uploadProgress > 0 && (
                                <div className="w-full bg-gray-700 rounded-full h-3">
                                  <div
                                    className="bg-[var(--neon-green)] h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="text-2xl">🖼️</div>
                              <div className="text-base">클릭하여 배경 이미지 선택</div>
                              <div className="text-sm text-gray-500">또는 이미지 파일을 여기에 드래그</div>
                              <div className="text-xs text-gray-600">권장: 1920x1080 이상, 5MB 이하</div>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        이미지 URL
                      </label>
                      <Input
                        value={editForm.url}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEditForm(prev => ({ ...prev, url: e.target.value }))
                        }
                        theme={theme}
                        className="w-full"
                        placeholder="이미지 URL을 입력하거나 파일을 업로드하세요"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        설명
                      </label>
                      <Textarea
                        value={editForm.description || ''}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setEditForm(prev => ({ ...prev, description: e.target.value }))
                        }
                        theme={theme}
                        className="w-full"
                        placeholder="배경 이미지에 대한 설명을 입력하세요"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button
                      onClick={handleCancel}
                      theme={theme}
                      reverse={theme === "normal"}
                      className="px-4 py-2"
                    >
                      취소
                    </Button>
                    <Button
                      onClick={handleSave}
                      theme={theme}
                      className="font-semibold px-4 py-2"
                    >
                      저장
                    </Button>
                  </div>
                </ThemeDiv>
              </motion.div>
            ) : null}
          </motion.div>
        ) : null}

        {/* 로그인 슬라이드 이미지 관리 */}
        {activeTab === 'login-images' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <LoginImagesManager />
          </motion.div>
        ) : null}
      </motion.div>
    </ThemeDiv>
  );
} 