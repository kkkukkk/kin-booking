'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import Input from '@/components/base/Input';
import Textarea from '@/components/base/Textarea';
import Select from '@/components/base/Select';
import { EventStatus, EventStatusKo } from '@/types/model/events';
import { ArrowLeftIcon } from '@/components/icon/ArrowIcons';
import { generateRandomGradient, generateNeonGradient } from '@/util/gradientGenerator';
import { useUploadEventPoster } from '@/hooks/api/useEventMedia';
import { useCreateEvent } from '@/hooks/api/useEvents';
import useToast from '@/hooks/useToast';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const CreateEventPage = () => {
  const router = useRouter();
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const { canManageEvents, isLoading: authLoading } = useAdminAuth();

  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    eventDateTime: '',
    location: '',
    ticketPrice: '',
    status: EventStatus.Pending,
    maxTickets: '',
    ticketGradient: generateRandomGradient(),
  });

  const [selectedPosterFile, setSelectedPosterFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // API 훅들
  const uploadPosterMutation = useUploadEventPoster();
  const createEventMutation = useCreateEvent();
  const { showToast } = useToast();

  // 권한 체크
  if (authLoading) {
    return (
      <ThemeDiv className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <p>권한을 확인하는 중...</p>
        </div>
      </ThemeDiv>
    );
  }

  if (!canManageEvents) {
    return (
      <ThemeDiv className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">공연을 관리할 권한이 없습니다.</p>
          <Button
            theme={theme}
            onClick={() => router.push('/admin/events')}
            className="px-4 py-2"
          >
            목록으로 돌아가기
          </Button>
        </div>
      </ThemeDiv>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 입력 시 해당 필드의 유효성 검사 에러 제거
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 포스터 파일 선택 처리
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 검증 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        showToast({
          message: '파일 크기는 10MB 이하여야 합니다.',
          iconType: 'error',
          autoCloseTime: 3000,
        });
        return;
      }

      // 이미지 파일 타입 검증
      if (!file.type.startsWith('image/')) {
        showToast({
          message: '이미지 파일만 선택할 수 있습니다.',
          iconType: 'error',
          autoCloseTime: 3000,
        });
        return;
      }

      setSelectedPosterFile(file);

      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 파일 선택 초기화
  const handleFileReset = () => {
    setSelectedPosterFile(null);
    setPreviewUrl(null);
    // input 값도 초기화
    const fileInput = document.getElementById('poster-file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // 상세한 유효성 검사 함수
  const validateForm = () => {
    const errors: Record<string, string> = {};

    // 공연명 검사
    if (!formData.eventName.trim()) {
      errors.eventName = '공연명을 입력해주세요.';
    } else if (formData.eventName.trim().length < 2) {
      errors.eventName = '공연명은 2자 이상 입력해주세요.';
    } else if (formData.eventName.trim().length > 100) {
      errors.eventName = '공연명은 100자 이하로 입력해주세요.';
    }

    // 공연일시 검사
    if (!formData.eventDateTime) {
      errors.eventDateTime = '공연일시를 선택해주세요.';
    } else {
      const selectedDate = new Date(formData.eventDateTime);
      const now = new Date();
      if (selectedDate <= now) {
        errors.eventDateTime = '공연일시는 현재 시간보다 이후로 설정해주세요.';
      }
    }

    // 장소 검사
    if (!formData.location.trim()) {
      errors.location = '장소를 입력해주세요.';
    } else if (formData.location.trim().length < 2) {
      errors.location = '장소는 2자 이상 입력해주세요.';
    } else if (formData.location.trim().length > 200) {
      errors.location = '장소는 200자 이하로 입력해주세요.';
    }

    // 티켓 가격 검사
    if (!formData.ticketPrice) {
      errors.ticketPrice = '티켓 가격을 입력해주세요.';
    } else if (Number(formData.ticketPrice) < 0) {
      errors.ticketPrice = '티켓 가격은 0원 이상이어야 합니다.';
    } else if (Number(formData.ticketPrice) > 1000000) {
      errors.ticketPrice = '티켓 가격은 1,000,000원 이하여야 합니다.';
    }

    // 최대 티켓 수 검사
    if (!formData.maxTickets) {
      errors.maxTickets = '최대 티켓 수를 입력해주세요.';
    } else if (Number(formData.maxTickets) < 1) {
      errors.maxTickets = '최대 티켓 수는 1장 이상이어야 합니다.';
    } else if (Number(formData.maxTickets) > 10000) {
      errors.maxTickets = '최대 티켓 수는 10,000장 이하여야 합니다.';
    }

    // 설명 검사 (선택사항이지만 길이 제한)
    if (formData.description && formData.description.length > 2000) {
      errors.description = '공연 설명은 2,000자 이하로 입력해주세요.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 폼 데이터 확인

    if (!validateForm()) {
      showToast({
        message: '입력 정보를 확인하고 수정해주세요.',
        iconType: 'error',
        autoCloseTime: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. 공연 등록
      const newEvent = await createEventMutation.mutateAsync({
        eventName: formData.eventName,
        description: formData.description,
        eventDate: formData.eventDateTime,
        location: formData.location,
        ticketPrice: Number(formData.ticketPrice),
        status: formData.status,
        seatCapacity: Number(formData.maxTickets),
        ticketColor: formData.ticketGradient,
      });

      // 2. 포스터가 선택된 경우 업로드 (실패해도 공연 등록은 성공)
      if (selectedPosterFile) {
        try {
          await uploadPosterMutation.mutateAsync({
            eventId: newEvent.id,
            file: selectedPosterFile,
          });
        } catch (uploadError) {
          // 포스터 업로드 실패 시에도 공연 등록은 성공으로 처리
          showToast({
            message: '공연은 등록되었지만 포스터 업로드에 실패했습니다. 관리자에게 문의해주세요.',
            iconType: 'warning',
            autoCloseTime: 3000,
          });
        }
      }

      // 성공 시 목록 페이지로 이동
      showToast({
        message: '공연이 성공적으로 등록되었습니다!',
        iconType: 'success',
        autoCloseTime: 3000,
      });
      router.push('/admin/events');
    } catch (error) {
      showToast({
        message: '공연 생성에 실패했습니다.',
        iconType: 'error',
        autoCloseTime: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/events');
  };

  // 폼 유효성 검사 (기본적인 필수 필드 체크) - 현재는 사용하지 않음
  // const isFormValid = formData.eventName && formData.eventDateTime &&
  //   formData.location && formData.ticketPrice && formData.maxTickets;

  return (
    <ThemeDiv className="min-h-full">
      <div className="px-6 py-4 space-y-6">
        {/* 헤더 */}
        <div className="flex items-center gap-4">
          <Button
            theme={theme}
            variant="default"
            onClick={handleCancel}
            className="px-2 py-1"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <div className={`${theme === 'neon' ? 'text-green-400' : ''}`}>
            <h1 className="text-xl font-bold">새 공연 등록</h1>
          </div>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-6">
          {/* 3열 그리드 레이아웃 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 포스터 이미지 섹션 */}
            <div className="md:col-span-1">
              <ThemeDiv className="rounded-lg p-4 md:h-[550px]">
                <h2 className="text-lg font-semibold mb-3">포스터 이미지</h2>
                <div className="flex flex-col items-center justify-center md:h-[450px]">
                  <div className="text-center w-full max-w-sm">
                    {selectedPosterFile ? (
                      /* 파일 선택 완료 + 이미지 미리보기 */
                      <div className="text-center">
                        <div className="w-48 h-64 mx-auto mb-4 rounded-lg overflow-hidden relative">
                          {previewUrl ? (
                            <Image
                              src={previewUrl}
                              alt="포스터 미리보기"
                              fill
                              className="object-cover"
                              sizes="192px"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2 mb-4">
                          <p className="text-xs break-all">{selectedPosterFile.name}</p>
                          <p className="text-xs">
                            {(selectedPosterFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <div className="flex justify-center">
                          <Button
                            theme={theme}
                            onClick={handleFileReset}
                            className="px-3 py-2 text-sm"
                          >
                            다시 선택
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* 파일 선택 UI */
                      <ThemeDiv isChildren className="border-2 border-dashed rounded-lg p-8 mb-4">
                        <svg className="mx-auto h-16 w-16 mb-4 opacity-60" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="text-lg font-medium mb-2">포스터 이미지 업로드</p>
                        <input
                          id="poster-file-input"
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className={`w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:opacity-80 ${theme === 'normal'
                              ? 'file:bg-gray-200 file:text-gray-700'
                              : 'file:bg-gray-500 file:text-gray-100'
                            }`}
                        />
                      </ThemeDiv>
                    )}

                    <p className="text-xs mt-4">PNG, JPG, GIF 최대 10MB</p>
                  </div>
                </div>
              </ThemeDiv>
            </div>

            {/* 기본 정보 섹션 */}
            <div className="md:col-span-1">
              <ThemeDiv className="rounded-lg p-4 md:h-[550px]">
                <h2 className="text-lg font-semibold mb-3">기본 정보</h2>
                <div className="space-y-4">
                  {/* 공연명 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      공연명 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      theme={theme}
                      value={formData.eventName}
                      onChange={(e) => handleInputChange('eventName', e.target.value)}
                      placeholder="공연명을 입력하세요"
                      required
                    />
                    {validationErrors.eventName && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.eventName}</p>
                    )}
                  </div>

                  {/* 공연일시 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      공연 일시 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      theme={theme}
                      type="datetime-local"
                      value={formData.eventDateTime}
                      onChange={(e) => handleInputChange('eventDateTime', e.target.value)}
                      required
                    />
                    {validationErrors.eventDateTime && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.eventDateTime}</p>
                    )}
                  </div>

                  {/* 장소 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      공연 장소 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      theme={theme}
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="공연 장소를 입력하세요"
                      required
                    />
                    {validationErrors.location && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.location}</p>
                    )}
                  </div>

                  {/* 상태 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      상태 <span className="text-red-500">*</span>
                    </label>
                    <Select
                      theme={theme}
                      value={formData.status}
                      onChange={(value) => handleInputChange('status', value)}
                      options={[
                        { value: EventStatus.Pending, label: EventStatusKo[EventStatus.Pending] },
                        { value: EventStatus.Ongoing, label: EventStatusKo[EventStatus.Ongoing] },
                        { value: EventStatus.SoldOut, label: EventStatusKo[EventStatus.SoldOut] },
                        { value: EventStatus.Completed, label: EventStatusKo[EventStatus.Completed] },
                      ]}
                    />
                  </div>
                </div>
              </ThemeDiv>
            </div>

            {/* 티켓 정보 섹션 */}
            <div className="md:col-span-1">
              <ThemeDiv className="rounded-lg p-4 md:h-[550px]">
                <h2 className="text-lg font-semibold mb-3">티켓 정보</h2>
                <div className="space-y-4">
                  {/* 티켓 가격 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      티켓 가격 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      theme={theme}
                      type="number"
                      value={formData.ticketPrice}
                      onChange={(e) => handleInputChange('ticketPrice', e.target.value)}
                      placeholder="티켓 가격을 입력하세요"
                      min="0"
                      required
                    />
                    {validationErrors.ticketPrice && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.ticketPrice}</p>
                    )}
                  </div>

                  {/* 최대 티켓 수 */}
                  <div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        최대 티켓 수 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        theme={theme}
                        type="number"
                        value={formData.maxTickets}
                        onChange={(e) => handleInputChange('maxTickets', e.target.value)}
                        placeholder="최대 티켓 수를 입력하세요"
                        min="1"
                        required
                      />
                      {validationErrors.maxTickets && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.maxTickets}</p>
                      )}
                    </div>
                  </div>

                  {/* 티켓 그라데이션 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      티켓 색상 <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                      <div
                        className="w-full h-12 rounded-lg shadow-sm"
                        style={{ background: formData.ticketGradient }}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          theme={theme}
                          type="button"
                          onClick={() => handleInputChange('ticketGradient', generateRandomGradient())}
                          className="px-3 py-1.5 text-xs font-semibold"
                          reverse={theme === 'normal'}
                          light={true}
                        >
                          일반 그라데이션
                        </Button>
                        <Button
                          theme={theme}
                          type="button"
                          onClick={() => handleInputChange('ticketGradient', generateNeonGradient())}
                          className="px-3 py-1.5 text-xs font-semibold"
                        >
                          네온 그라데이션
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </ThemeDiv>
            </div>
          </div>

          {/* 설명 섹션 */}
          <div className="max-w-6xl mx-auto">
            <ThemeDiv className="rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">공연 설명</h2>
              <Textarea
                theme={theme}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="공연 설명을 입력하세요 (선택사항)"
                rows={8}
                className="min-h-[200px]"
              />
              {validationErrors.description && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.description}</p>
              )}
            </ThemeDiv>
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-center gap-3 pt-6 border-t border-gray-200">
            <Button
              theme={theme}
              reverse={theme === "normal"}
              onClick={handleCancel}
              type="button"
              className="px-6 py-2"
            >
              취소
            </Button>
            <Button
              theme={theme}
              onClick={handleSubmit}
              disabled={isSubmitting || createEventMutation.isPending}
              className="px-6 py-2"
            >
              {isSubmitting || createEventMutation.isPending ? '등록 중...' : '등록'}
            </Button>
          </div>
        </form>
      </div>
    </ThemeDiv>
  );
};

export default CreateEventPage;
