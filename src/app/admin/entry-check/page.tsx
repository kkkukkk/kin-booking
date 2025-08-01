'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import Button from '@/components/base/Button';
import { useSession } from '@/hooks/useSession';
import useToast from '@/hooks/useToast';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import ThemeDiv from '@/components/base/ThemeDiv';
import { TicketIcon } from '@/components/icon/TicketIcon';
import CheckCircleIcon from '@/components/icon/CheckCircleIcon';
import XCircleIcon from '@/components/icon/XCircleIcon';

interface TicketInfo {
	ticketNumber: number;
	eventId: string;
	userId: string;
	reservationId: string;
	eventName?: string;
	userName?: string;
	status?: string;
}

const EntryCheckPage = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { session } = useSession();
	const { showToast } = useToast();
	const theme = useAppSelector((state: RootState) => state.theme.current);
	
	const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	// URL 파라미터에서 직접 접근한 경우 처리
	useEffect(() => {
		const ticket = searchParams.get('ticket');
		const event = searchParams.get('event');
		const user = searchParams.get('user');
		const reservation = searchParams.get('reservation');

		if (ticket && event && user && reservation) {
			processTicketData({
				ticketNumber: parseInt(ticket),
				eventId: event,
				userId: user,
				reservationId: reservation
			});
		}
	}, [searchParams]);

	// QR 스캔 결과 처리 (URL 파라미터에서 직접 처리)
	const handleScanFromURL = (data: string) => {
		try {
			// URL 파싱
			const url = new URL(data);
			const params = new URLSearchParams(url.search);
			
			const ticketInfo: TicketInfo = {
				ticketNumber: parseInt(params.get('ticket') || '0'),
				eventId: params.get('event') || '',
				userId: params.get('user') || '',
				reservationId: params.get('reservation') || ''
			};

			processTicketData(ticketInfo);
		} catch (error) {
			showToast({
				message: '올바르지 않은 QR 코드입니다.',
				iconType: 'error',
				autoCloseTime: 3000,
			});
		}
	};

	// 티켓 정보 처리
	const processTicketData = async (info: TicketInfo) => {
		setIsProcessing(true);
		setTicketInfo(info);

		try {
			// TODO: 실제 API 호출로 티켓 정보 조회
			// const response = await fetchTicketInfo(info);
			// setTicketInfo({ ...info, ...response });

			// 임시로 성공 처리
			setTimeout(() => {
				setIsProcessing(false);
				setIsSuccess(true);
				showToast({
					message: '입장 처리가 완료되었습니다.',
					iconType: 'success',
					autoCloseTime: 3000,
				});
			}, 2000);

		} catch (error) {
			setIsProcessing(false);
			showToast({
				message: '티켓 정보 조회에 실패했습니다.',
				iconType: 'error',
				autoCloseTime: 3000,
			});
		}
	};

	// 입장 승인 처리
	const handleApproveEntry = async () => {
		if (!ticketInfo) return;

		setIsProcessing(true);
		try {
			// TODO: 실제 입장 승인 API 호출
			// await approveEntry(ticketInfo);

			setTimeout(() => {
				setIsProcessing(false);
				setIsSuccess(true);
				showToast({
					message: '입장이 승인되었습니다.',
					iconType: 'success',
					autoCloseTime: 3000,
				});
			}, 1000);

		} catch (error) {
			setIsProcessing(false);
			showToast({
				message: '입장 승인에 실패했습니다.',
				iconType: 'error',
				autoCloseTime: 3000,
			});
		}
	};

	// 입장 거부 처리
	const handleRejectEntry = async () => {
		if (!ticketInfo) return;

		setIsProcessing(true);
		try {
			// TODO: 실제 입장 거부 API 호출
			// await rejectEntry(ticketInfo);

			setTimeout(() => {
				setIsProcessing(false);
				showToast({
					message: '입장이 거부되었습니다.',
					iconType: 'error',
					autoCloseTime: 3000,
				});
				resetState();
			}, 1000);

		} catch (error) {
			setIsProcessing(false);
			showToast({
				message: '입장 거부에 실패했습니다.',
				iconType: 'error',
				autoCloseTime: 3000,
			});
		}
	};

	// 상태 초기화
	const resetState = () => {
		setTicketInfo(null);
		setIsSuccess(false);
		setIsProcessing(false);
	};

	// 새로 스캔
	const handleNewScan = () => {
		resetState();
		router.push('/admin/qr-scanner');
	};

	if (!session?.user) {
		return (
			<ThemeDiv className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">접근 권한이 없습니다</h1>
					<p className="text-gray-600 mb-4">관리자 로그인이 필요합니다.</p>
					<Button
						theme="normal"
						onClick={() => router.push('/login')}
						padding='px-6 py-2'
					>
						로그인하기
					</Button>
				</div>
			</ThemeDiv>
		);
	}

	return (
		<ThemeDiv className="min-h-screen p-4">
			<div className="max-w-md mx-auto">
				{/* 헤더 */}
				<div className="text-center mb-8">
					<h1 className="text-2xl font-bold mb-2">입장 확인</h1>
					<p className="text-gray-600">QR 코드를 스캔하여 입장을 확인하세요</p>
				</div>

				{/* 안내 메시지 */}
				{!ticketInfo && (
					<div className="text-center space-y-4">
						<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
							<TicketIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
							<h2 className="text-xl font-bold mb-2">입장 확인</h2>
							<p className="text-gray-600 mb-4">
								QR 코드를 스캔하거나 링크를 통해 접속하여 입장을 확인하세요
							</p>
							
							<div className="text-sm text-gray-500 text-left">
								<p className="font-semibold mb-2">사용 방법:</p>
								<ul className="space-y-1">
									<li>• <strong>QR 스캔:</strong> 사이드바의 "QR 스캔" 메뉴 사용</li>
									<li>• <strong>앱 스캔:</strong> 카카오톡/네이버 앱으로 스캔 후 링크 접속</li>
									<li>• <strong>직접 접근:</strong> 사용자가 QR 코드를 보여주면 직접 확인</li>
								</ul>
							</div>
						</div>
					</div>
				)}

				{/* 티켓 정보 표시 */}
				{ticketInfo && (
					<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
						<div className="text-center mb-6">
							{isSuccess ? (
								<CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
							) : (
								<TicketIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
							)}
							
							<h2 className="text-xl font-bold mb-2">
								{isSuccess ? '입장 완료' : '티켓 정보'}
							</h2>
						</div>

						<div className="space-y-3 mb-6">
							<div className="flex justify-between">
								<span className="text-gray-600">티켓 번호:</span>
								<span className="font-semibold">{ticketInfo.ticketNumber}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">예매 ID:</span>
								<span className="font-semibold">{ticketInfo.reservationId.slice(0, 8)}...</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">사용자 ID:</span>
								<span className="font-semibold">{ticketInfo.userId.slice(0, 8)}...</span>
							</div>
						</div>

						{/* 액션 버튼 */}
						{!isSuccess && !isProcessing && (
							<div className="flex gap-3">
								<Button
									theme="normal"
									onClick={handleApproveEntry}
									padding='px-6 py-3'
									className="flex-1"
								>
									<CheckCircleIcon className="w-5 h-5 mr-2" />
									입장 승인
								</Button>
								<Button
									theme="dark"
									onClick={handleRejectEntry}
									padding='px-6 py-3'
									className="flex-1"
								>
									<XCircleIcon className="w-5 h-5 mr-2" />
									입장 거부
								</Button>
							</div>
						)}

						{/* 처리 중 */}
						{isProcessing && (
							<div className="text-center py-4">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
								<p className="text-gray-600">처리 중...</p>
							</div>
						)}

						{/* 성공 후 */}
						{isSuccess && (
							<div className="text-center">
								<Button
									theme="normal"
									onClick={handleNewScan}
									padding='px-6 py-3'
									className="w-full"
								>
									새로 스캔
								</Button>
							</div>
						)}
					</div>
				)}

				{/* QR 스캐너는 별도 페이지로 분리됨 */}
			</div>
		</ThemeDiv>
	);
};

export default EntryCheckPage; 