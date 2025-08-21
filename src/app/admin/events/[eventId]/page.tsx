'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import Button from '@/components/base/Button';
import Input from '@/components/base/Input';
import Textarea from '@/components/base/Textarea';
import Select from '@/components/base/Select';
import ThemeDiv from '@/components/base/ThemeDiv';
import { StatusBadge } from '@/components/status/StatusBadge';
import { ArrowLeftIcon } from '@/components/icon/ArrowIcons';
import { generateRandomGradient, generateNeonGradient } from '@/util/gradientGenerator';
import dayjs from 'dayjs';
import { EventStatus, EventStatusKo } from '@/types/model/events';
import { useEventFromEventsTable } from '@/hooks/api/useEvents';
import { useEventMediaByType, useUploadEventPoster } from '@/hooks/api/useEventMedia';
import { useUpdateEvent, useDeleteEvent, useCompleteEvent } from '@/hooks/api/useEvents';
import useToast from '@/hooks/useToast';
import { useAlert } from '@/providers/AlertProvider';
import EventPoster from '@/app/events/[eventId]/components/EventPoster';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import Spinner from '@/components/spinner/Spinner';

const EditEventPage = () => {
    const router = useRouter();
    const params = useParams();
    const eventId = params.eventId as string;
    const theme = useAppSelector((state: RootState) => state.theme.current);

    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPosterFile, setSelectedPosterFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        eventName: '',
        description: '',
        eventDateTime: '',
        location: '',
        status: EventStatus.Pending,
        ticketPrice: 0,
        maxTickets: 0,
        ticketGradient: '',
    });

    // 훅을 사용하여 공연 정보 조회
    const { data: event, isLoading, error } = useEventFromEventsTable(eventId);

    // 포스터 이미지 조회
    const { data: posterImages } = useEventMediaByType(eventId, 'image');

    // 공연 정보 업데이트
    const updateEventMutation = useUpdateEvent();

    // 포스터 교체 관련 훅들
    const uploadPosterMutation = useUploadEventPoster();

    // 공연 삭제
    const deleteEventMutation = useDeleteEvent();

    // 공연 완료
    const completeEventMutation = useCompleteEvent();

    const { showToast } = useToast();
    const { showAlert } = useAlert();

    // 관리자 권한 체크
    const { canManageEvents } = useAdminAuth();

    // 공연 완료 처리
    const handleCompleteEvent = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const confirmed = await showAlert({
            title: '공연 종료 확인',
            message: `"${event?.eventName}" 공연을 종료하시겠습니까?\n\n• 대기중인 예매가 모두 취소됩니다\n• 이 작업은 되돌릴 수 없습니다`,
            type: 'confirm'
        });

        if (confirmed) {
            completeEventMutation.mutate(eventId, {
                onSuccess: () => {
                    showToast({
                        message: `"${event?.eventName}" 공연이 종료되었습니다.`,
                        iconType: 'success',
                        autoCloseTime: 3000,
                    });
                },
                onError: (error) => {
                    console.error('공연 완료 실패:', error);
                    showToast({
                        message: '공연 완료에 실패했습니다.',
                        iconType: 'error',
                        autoCloseTime: 3000,
                    });
                }
            });
        }
    };

    useEffect(() => {
        if (event) {
            setFormData({
                eventName: event.eventName,
                description: event.description || '',
                eventDateTime: dayjs(event.eventDate).format('YYYY-MM-DDTHH:mm'),
                location: event.location,
                status: event.status,
                ticketPrice: event.ticketPrice,
                maxTickets: event.seatCapacity,
                ticketGradient: event.ticketColor || 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            });
        }
    }, [event]);

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedPosterFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileReset = () => {
        setSelectedPosterFile(null);
        setPreviewUrl(null);
        const fileInput = document.getElementById('poster-file-input') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handlePosterReplacement = async () => {
        if (!selectedPosterFile) return;

        try {
            // 새 포스터 업로드 (기존 파일 덮어쓰기)
            await uploadPosterMutation.mutateAsync({
                eventId: eventId,
                file: selectedPosterFile,
            });
        } catch (error) {
            console.error('포스터 교체 실패:', error);
            throw new Error('포스터 교체에 실패했습니다.');
        }
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            // 1. 공연 정보 업데이트
            await updateEventMutation.mutateAsync({
                id: eventId,
                event: {
                    eventName: formData.eventName,
                    description: formData.description,
                    eventDate: dayjs(formData.eventDateTime).toISOString(),
                    location: formData.location,
                    status: formData.status,
                    ticketPrice: formData.ticketPrice,
                    seatCapacity: formData.maxTickets,
                    ticketColor: formData.ticketGradient,
                }
            });

            // 2. 포스터가 수정된 경우 교체
            if (selectedPosterFile) {
                await handlePosterReplacement();
            }

            // 3. 모든 작업 성공 시 편집 모드 종료 및 데이터 갱신
            setIsEditing(false);
            showToast({
                message: '공연 정보가 성공적으로 저장되었습니다.',
                iconType: 'success',
                autoCloseTime: 3000,
            });
        } catch (error) {
            console.error('저장 실패:', error);
            showToast({
                message: '공연 정보 저장에 실패했습니다.',
                iconType: 'error',
                autoCloseTime: 3000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        // 폼 데이터를 원래 이벤트 데이터로 초기화
        if (event) {
            setFormData({
                eventName: event.eventName,
                description: event.description || '',
                eventDateTime: event.eventDate,
                location: event.location,
                status: event.status,
                ticketPrice: event.ticketPrice,
                maxTickets: event.seatCapacity,
                ticketGradient: event.ticketColor || 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            });
        }
        setIsEditing(false);
    };

    const handleBack = () => {
        router.push('/admin/events');
    };

    const handleDelete = async () => {
        const result = await showAlert({
            type: 'confirm',
            title: '공연 삭제',
            message: '정말로 이 공연을 삭제하시겠습니까?\n삭제된 공연은 복구할 수 없습니다.'
        });

        if (result) {
            try {
                await deleteEventMutation.mutateAsync(eventId);
                showToast({
                    message: '공연 삭제가 완료되었습니다.',
                    iconType: 'success',
                    autoCloseTime: 3000,
                });
                router.push('/admin/events');
            } catch (error) {
                console.error('공연 삭제 실패:', error);
                showToast({
                    message: '공연 삭제에 실패했습니다.',
                    iconType: 'error',
                    autoCloseTime: 3000,
                });
            }
        }
    };

    // 로딩 상태
    if (isLoading) {
        return (
            <ThemeDiv className="min-h-full">
                <div className="px-6 py-4 space-y-4 md:py-6 md:space-y-6 flex-shrink-0">
                    <div className={`${theme === 'neon' ? 'text-green-400' : ''}`}>
                        <h1 className="text-lg md:text-xl font-bold">공연 상세 정보</h1>
                    </div>
                </div>
                <div className="px-6 pb-6 flex-1 flex flex-col min-h-fit md:min-h-0">
                    <div className="flex items-center justify-center h-64">
                        <Spinner />
                    </div>
                </div>
            </ThemeDiv>
        );
    }

    // 에러 상태
    if (error) {
        return (
            <ThemeDiv className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">오류가 발생했습니다</h2>
                    <p className="text-red-500 mb-6">공연 정보를 불러오는데 실패했습니다.</p>
                    <Button onClick={handleBack} className="px-6 py-2">목록으로</Button>
                </div>
            </ThemeDiv>
        );
    }

    // 데이터가 없는 경우
    if (!event) {
        return (
            <ThemeDiv className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">공연을 찾을 수 없습니다</h2>
                    <p className="text-gray-600 mb-6">요청하신 공연 정보가 존재하지 않습니다.</p>
                    <Button onClick={handleBack} className="px-6 py-2">목록으로</Button>
                </div>
            </ThemeDiv>
        );
    }

    return (
        <ThemeDiv className="min-h-full">
            <div className="px-6 py-4 space-y-6">
                {/* 헤더 */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Button
                            theme={theme}
                            onClick={handleBack}
                            padding="px-2 py-1"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold">공연 상세 정보</h1>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {!isEditing ? (
                            <>
                                {canManageEvents && (
                                    <>
                                        {event?.status === EventStatus.Ongoing && (
                                            <button
                                                type="button"
                                                onClick={(e) => handleCompleteEvent(e)}
                                                className={`px-3 py-1 rounded font-semibold transition-colors ${theme === 'normal'
                                                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                                                    : theme === 'dark'
                                                        ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                                                        : 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white'
                                                    }`}
                                            >
                                                공연 종료
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            className={`px-3 py-1 rounded font-semibold transition-colors ${theme === 'normal'
                                                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                                                : theme === 'dark'
                                                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                                                    : 'bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white'
                                                }`}
                                        >
                                            삭제
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className={`px-3 py-1 rounded font-semibold transition-colors ${theme === 'normal'
                                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                                                : theme === 'dark'
                                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                                                    : 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white'
                                                }`}
                                        >
                                            편집
                                        </button>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isSubmitting}
                                    className={`px-3 py-1 rounded font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${theme === 'normal'
                                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                                        : theme === 'dark'
                                            ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                                            : 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white'
                                        }`}
                                >
                                    {isSubmitting ? '저장 중...' : '저장'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className={`px-3 py-1 rounded font-semibold transition-colors ${theme === 'normal'
                                        ? 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white'
                                        : theme === 'dark'
                                            ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white'
                                            : 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white'
                                        }`}
                                >
                                    취소
                                </button>
                            </>
                        )}
                    </div>
                </div>



                {/* 현재 상태 표시 */}
                <div className="max-w-6xl mx-auto">
                    <ThemeDiv className="flex items-center gap-4 p-4 rounded-lg h-[60px]">
                        <span className="text-sm font-medium whitespace-nowrap">현재 상태:</span>
                        <div className="min-w-0 flex-1">
                            {isEditing && canManageEvents ? (
                                <Select
                                    theme={theme}
                                    value={formData.status}
                                    onChange={(value) => handleInputChange('status', value)}
                                    options={[
                                        { value: EventStatus.Pending, label: EventStatusKo[EventStatus.Pending] },
                                        { value: EventStatus.Ongoing, label: EventStatusKo[EventStatus.Ongoing] },
                                        { value: EventStatus.SoldOut, label: EventStatusKo[EventStatus.SoldOut] },
                                    ]}
                                />
                            ) : (
                                <StatusBadge
                                    status={event?.status || EventStatus.Pending}
                                    theme={theme}
                                    statusType="event"
                                    variant="badge"
                                    size="sm"
                                />
                            )}
                        </div>
                    </ThemeDiv>
                </div>

                {/* 메인 컨텐츠 영역 */}
                <div className="max-w-6xl mx-auto">
                    {/* 포스터(1/3), 정보(1/3), 설명(1/3) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* 포스터 이미지 */}
                        <div className="md:col-span-1">
                            <ThemeDiv className="rounded-lg p-4 md:h-[550px]">
                                <h2 className="text-lg font-semibold mb-3">포스터 이미지</h2>

                                {isEditing ? (
                                    /* 수정 모드: 업로드 전용 UI */
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
                                                    <p className="text-lg font-medium mb-2">포스터 이미지 변경</p>
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
                                ) : (
                                    /* 조회 모드: 기존 포스터 표시 */
                                    posterImages && posterImages.length > 0 ? (
                                        <div className="flex items-center justify-center">
                                            <EventPoster
                                                eventName={event?.eventName || ''}
                                                posterData={posterImages}
                                                theme={theme}
                                                isLoading={isLoading}
                                                priority={true}
                                                loading="eager"
                                                showPlaceholderText={true}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-[450px]">
                                            <div className="text-center">
                                                <p className="text-lg font-medium text-gray-600 mb-2">포스터 이미지 없음</p>
                                                <p className="text-sm text-gray-500">아직 등록된 포스터가 없습니다</p>
                                            </div>
                                        </div>
                                    )
                                )}
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
                                            공연명 {isEditing && <span className="text-red-500">*</span>}
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                theme={theme}
                                                value={formData.eventName}
                                                onChange={(e) => handleInputChange('eventName', e.target.value)}
                                                placeholder="공연명을 입력하세요"
                                                required
                                            />
                                        ) : (
                                            <ThemeDiv className="px-2 py-1 rounded" isChildren={true}>{event?.eventName || ''}</ThemeDiv>
                                        )}
                                    </div>

                                    {/* 공연일시 */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            공연일시 {isEditing && <span className="text-red-500">*</span>}
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                theme={theme}
                                                type="datetime-local"
                                                value={formData.eventDateTime}
                                                onChange={(e) => handleInputChange('eventDateTime', e.target.value)}
                                                required
                                            />
                                        ) : (
                                            <ThemeDiv className="px-2 py-1 rounded" isChildren={true}>
                                                {event?.eventDate ? dayjs(event.eventDate).format('YYYY-MM-DD HH:mm') : ''}
                                            </ThemeDiv>
                                        )}
                                    </div>

                                    {/* 장소 */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            장소 {isEditing && <span className="text-red-500">*</span>}
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                theme={theme}
                                                value={formData.location}
                                                onChange={(e) => handleInputChange('location', e.target.value)}
                                                placeholder="공연 장소를 입력하세요"
                                                required
                                            />
                                        ) : (
                                            <ThemeDiv className="px-2 py-1 rounded" isChildren={true}>
                                                {event?.location || '장소 미정'}
                                            </ThemeDiv>
                                        )}
                                    </div>

                                    {/* 티켓 가격 */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            티켓 가격 {isEditing && <span className="text-red-500">*</span>}
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                theme={theme}
                                                type="number"
                                                value={formData.ticketPrice}
                                                onChange={(e) => handleInputChange('ticketPrice', e.target.value)}
                                                placeholder="티켓 가격을 입력하세요"
                                                min="0"
                                                required
                                            />
                                        ) : (
                                            <ThemeDiv className="px-2 py-1 rounded" isChildren={true}>
                                                {event?.ticketPrice?.toLocaleString() || 0}원
                                            </ThemeDiv>
                                        )}
                                    </div>

                                    {/* 최대 티켓 수 */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            최대 티켓 수 {isEditing && <span className="text-red-500">*</span>}
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                theme={theme}
                                                type="number"
                                                value={formData.maxTickets}
                                                onChange={(e) => handleInputChange('maxTickets', e.target.value)}
                                                placeholder="최대 티켓 수를 입력하세요"
                                                min="1"
                                                required
                                            />
                                        ) : (
                                            <ThemeDiv className="px-2 py-1 rounded" isChildren={true}>
                                                {event?.seatCapacity || '제한 없음'}
                                            </ThemeDiv>
                                        )}
                                    </div>

                                    {/* 티켓 색상 */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            티켓 색상 {isEditing && <span className="text-red-500">*</span>}
                                        </label>
                                        {isEditing ? (
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-36 h-10 rounded-lg shadow-sm"
                                                    style={{ background: formData.ticketGradient }}
                                                />
                                                <div className="flex gap-2">
                                                    <Button
                                                        theme={theme}
                                                        type="button"
                                                        onClick={() => handleInputChange('ticketGradient', generateRandomGradient())}
                                                        className="px-3 py-1.5 text-xs font-semibold"
                                                        reverse={theme === 'normal'}
                                                        light={true}
                                                    >
                                                        일반
                                                    </Button>
                                                    <Button
                                                        theme={theme}
                                                        type="button"
                                                        onClick={() => handleInputChange('ticketGradient', generateNeonGradient())}
                                                        className="px-3 py-1.5 text-xs font-semibold"
                                                    >
                                                        네온
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-20 h-10 rounded ${!event?.ticketColor ? 'border-2 border-dashed border-gray-300' : ''}`}
                                                    style={{
                                                        background: event?.ticketColor || 'transparent'
                                                    }}
                                                />
                                                {!event?.ticketColor && (
                                                    <span className="text-sm text-gray-500">색상 미설정</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </ThemeDiv>
                        </div>
                        {/* 설명 섹션 - 1/3 */}
                        <div className="md:col-span-1">
                            <ThemeDiv className="rounded-lg p-4 md:h-[550px]">
                                <h2 className="text-lg font-semibold mb-3">공연 설명</h2>
                                {isEditing ? (
                                    <Textarea
                                        theme={theme}
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        placeholder="공연 설명을 입력하세요 (선택사항)"
                                        rows={10}
                                        className="md:min-h-[475px]"
                                    />
                                ) : (
                                    <ThemeDiv className="px-4 py-3 rounded md:min-h-[475px] md:max-h-[475px] overflow-y-auto whitespace-pre-wrap" isChildren={true}>
                                        {event?.description || '설명 없음'}
                                    </ThemeDiv>
                                )}
                            </ThemeDiv>
                        </div>
                    </div>
                </div>
            </div>
        </ThemeDiv>
    );
};

export default EditEventPage;
