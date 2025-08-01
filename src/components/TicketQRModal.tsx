'use client'

import React, { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import QRCode from 'qrcode';
import Button from '@/components/base/Button';

interface TicketQRModalProps {
	isOpen: boolean;
	onClose: () => void;
	ticketNumbers: number[];
	eventName: string;
	eventId: string;
	userId: string;
	reservationId: string;
}

const TicketQRModal = ({ isOpen, onClose, ticketNumbers, eventName, eventId, userId, reservationId }: TicketQRModalProps) => {
	const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

	// QR코드 생성
	useEffect(() => {
		if (isOpen && ticketNumbers.length > 0) {
			generateQRCode();
		}
	}, [isOpen, ticketNumbers]);

	const generateQRCode = async () => {
		try {
			// 현재 도메인 기반으로 전체 링크 생성
			const baseUrl = typeof window !== 'undefined' 
				? 'http://192.168.240.51:3000' 
				: 'https://kin-booking.vercel.app';
			
			const qrData = `${baseUrl}/admin/entry-check?ticket=${ticketNumbers[0]}&event=${eventId}&user=${userId}&reservation=${reservationId}`;
			const dataUrl = await QRCode.toDataURL(qrData, {
				width: 200,
				margin: 2,
				color: {
					dark: '#000000',
					light: '#FFFFFF'
				}
			});
			setQrCodeDataUrl(dataUrl);
		} catch (error) {
			console.error('QR코드 생성 실패:', error);
		}
	};

	if (!isOpen) return null;

	return (
		<Modal onClose={onClose}>
			<div className="text-center space-y-4 flex flex-col items-center">
				<h3 className="text-lg font-bold">입장 QR코드</h3>
				
				{qrCodeDataUrl && (
					<div className="flex justify-center">
						<img 
							src={qrCodeDataUrl} 
							alt="입장 QR코드" 
							className="border-2 border-gray-200 rounded-lg"
						/>
					</div>
				)}
				
				<div className="space-y-3 text-sm">
					<div className="w-full">
						<p className="text-left">공연: {eventName}</p>
						<p className="mt-1 text-left">티켓: {ticketNumbers.length}장</p>
						<p className="mt-1 text-xs text-gray-400">입장 시 스태프에게 QR코드를 보여주세요!</p>
					</div>
				</div>
				
				<Button
					theme="dark"
					onClick={onClose}
					padding='px-4 py-1.5'
					fontSize='text-sm'
					className="transition-colors"
				>
					닫기
				</Button>
			</div>
		</Modal>
	);
};

export default TicketQRModal; 