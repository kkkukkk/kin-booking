'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import QRScanner from '@/components/QRScanner';
import { useSession } from '@/hooks/useSession';
import useToast from '@/hooks/useToast';
import ThemeDiv from '@/components/base/ThemeDiv';

const QRScannerPage = () => {
	const router = useRouter();
	const { session } = useSession();
	const { showToast } = useToast();
	
	const [isScannerOpen, setIsScannerOpen] = useState(true);

	// QR 스캔 결과 처리
	const handleScan = (data: string) => {
		try {
			// URL 파싱
			const url = new URL(data);
			const params = new URLSearchParams(url.search);
			
			// 필수 파라미터 확인
			const ticket = params.get('ticket');
			const event = params.get('event');
			const user = params.get('user');
			const reservation = params.get('reservation');

			if (ticket && event && user && reservation) {
				// entry-check 페이지로 리다이렉트
				const redirectUrl = `/admin/entry-check?ticket=${ticket}&event=${event}&user=${user}&reservation=${reservation}`;
				router.push(redirectUrl);
			} else {
				throw new Error('올바르지 않은 QR 코드입니다.');
			}
		} catch (error) {
			showToast({
				message: '올바르지 않은 QR 코드입니다.',
				iconType: 'error',
				autoCloseTime: 3000,
			});
			// 스캐너 다시 열기
			setIsScannerOpen(true);
		}
	};

	// 스캐너 닫기
	const handleCloseScanner = () => {
		setIsScannerOpen(false);
		router.push('/admin/entry-check');
	};

	if (!session?.user) {
		return (
			<ThemeDiv className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">접근 권한이 없습니다</h1>
					<p className="text-gray-600 mb-4">관리자 로그인이 필요합니다.</p>
					<button
						onClick={() => router.push('/login')}
						className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
					>
						로그인하기
					</button>
				</div>
			</ThemeDiv>
		);
	}

	return (
		<ThemeDiv className="min-h-screen">
			{/* QR 스캐너 모달 */}
			<QRScanner
				isOpen={isScannerOpen}
				onClose={handleCloseScanner}
				onScan={handleScan}
			/>
		</ThemeDiv>
	);
};

export default QRScannerPage; 