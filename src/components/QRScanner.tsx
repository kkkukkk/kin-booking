'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react';
import jsQR from 'jsqr';
import Modal from '@/components/Modal';
import Button from '@/components/base/Button';
import { CloseIcon } from '@/components/icon/CloseIcon';

interface QRScannerProps {
	isOpen: boolean;
	onClose: () => void;
	onScan: (data: string) => void;
}

const QRScanner = ({ isOpen, onClose, onScan }: QRScannerProps) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const animationRef = useRef<number>(0);
	const [isScanning, setIsScanning] = useState(false);
	const [error, setError] = useState<string>('');

	// 카메라 스트림 시작
	const startCamera = async () => {
		try {
			setError('');

			// 브라우저 호환성 확인
			if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
				throw new Error('이 브라우저는 카메라 접근을 지원하지 않습니다.');
			}

			// getUserMedia API 호환성 처리
			const getUserMedia = navigator.mediaDevices.getUserMedia ||
				(navigator as Navigator & { getUserMedia?: typeof navigator.mediaDevices.getUserMedia }).getUserMedia ||
				(navigator as Navigator & { webkitGetUserMedia?: typeof navigator.mediaDevices.getUserMedia }).webkitGetUserMedia ||
				(navigator as Navigator & { mozGetUserMedia?: typeof navigator.mediaDevices.getUserMedia }).mozGetUserMedia ||
				(navigator as Navigator & { msGetUserMedia?: typeof navigator.mediaDevices.getUserMedia }).msGetUserMedia;

			if (!getUserMedia) {
				throw new Error('카메라 접근 API를 지원하지 않습니다.');
			}

			const stream = await getUserMedia.call(navigator.mediaDevices, {
				video: {
					facingMode: 'environment', // 후면 카메라 우선
					width: { ideal: 1280 },
					height: { ideal: 720 }
				}
			});

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				streamRef.current = stream;
				setIsScanning(true);
			}
		} catch (err: unknown) {
			console.error('카메라 접근 실패:', err);

			// 구체적인 에러 메시지 제공
			const error = err as Error;
			if (error.name === 'NotAllowedError') {
				setError('카메라 권한이 거부되었습니다. 브라우저 설정에서 카메라 권한을 허용해주세요.');
			} else if (error.name === 'NotFoundError') {
				setError('카메라를 찾을 수 없습니다. 카메라가 연결되어 있는지 확인해주세요.');
			} else if (error.name === 'NotSupportedError') {
				setError('이 브라우저는 카메라 접근을 지원하지 않습니다. Chrome, Safari, Firefox를 사용해주세요.');
			} else {
				setError(`카메라 접근에 실패했습니다: ${error.message}`);
			}
		}
	};

	// QR 스캔 로직
	const scanQR = useCallback(() => {
		if (!videoRef.current || !canvasRef.current || !isScanning) return;

		const video = videoRef.current;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		if (!ctx) return;

		// 비디오가 준비되지 않았으면 다음 프레임에서 다시 시도
		if (video.readyState !== video.HAVE_ENOUGH_DATA) {
			animationRef.current = requestAnimationFrame(scanQR);
			return;
		}

		// 비디오 프레임을 캔버스에 그리기
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

		// 캔버스에서 이미지 데이터 추출
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		// jsQR로 QR 코드 검출
		const code = jsQR(imageData.data, imageData.width, imageData.height);

		if (code) {
			// QR 코드 발견!
			        // QR 코드 스캔 성공
			onScan(code.data);
			stopCamera();
			return;
		}

		// 다음 프레임에서 다시 스캔
		animationRef.current = requestAnimationFrame(scanQR);
	}, [isScanning, onScan]);

	// 카메라 중지
	const stopCamera = () => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach(track => track.stop());
			streamRef.current = null;
		}
		if (animationRef.current) {
			cancelAnimationFrame(animationRef.current);
		}
		setIsScanning(false);
	};

	// 모달 열릴 때 카메라 시작
	useEffect(() => {
		if (isOpen) {
			startCamera();
		} else {
			stopCamera();
		}

		return () => {
			stopCamera();
		};
	}, [isOpen]);

	// 비디오 로드 완료 시 스캔 시작
	useEffect(() => {
		if (videoRef.current && isScanning) {
			videoRef.current.onloadedmetadata = () => {
				scanQR();
			};
		}
	}, [isScanning, scanQR]);

	if (!isOpen) return null;

	return (
		<Modal onClose={onClose}>
			<div className="text-center space-y-6">
				{/* 헤더 */}
				<div className="flex justify-between items-center">
					<h3 className="text-xl font-bold">QR 코드 스캔</h3>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
					>
						<CloseIcon />
					</button>
				</div>

				{/* 안내 메시지 */}
				<div className="text-sm text-gray-600">
					<p>사용자의 입장 QR 코드를 스캔해주세요</p>
					<p className="mt-1">자동으로 인식되어 입장 확인 페이지로 이동합니다</p>
				</div>

				{error ? (
					<div className="space-y-4">
						<div className="text-red-500 text-sm p-4 bg-red-50 rounded-lg">
							{error}
						</div>

						{/* 대체 방법 안내 */}
						<div className="text-sm text-gray-600">
							<p className="font-semibold mb-2">대체 방법:</p>
							<ul className="text-left space-y-1">
								<li>• 카카오톡 QR 스캔 기능 사용</li>
								<li>• 네이버 앱 QR 스캔 기능 사용</li>
								<li>• 기타 QR 스캔 앱 사용</li>
								<li>• 스캔 후 링크를 복사하여 접속</li>
							</ul>
						</div>

						<div className="flex gap-2 justify-center">
							<Button
								theme="normal"
								onClick={startCamera}
								padding='px-4 py-2'
								fontSize='text-sm'
							>
								다시 시도
							</Button>
							<Button
								theme="dark"
								onClick={onClose}
								padding='px-4 py-2'
								fontSize='text-sm'
							>
								닫기
							</Button>
						</div>
					</div>
				) : (
					<div className="space-y-4">
						{/* 비디오 요소 */}
						<div className="relative">
							<video
								ref={videoRef}
								autoPlay
								playsInline
								muted
								className="w-full max-w-md mx-auto rounded-lg border-2 border-gray-300"
							/>

							{/* 스캔 영역 표시 */}
							<div className="absolute inset-0 max-w-md mx-auto flex items-center justify-center pointer-events-none">
								<div className="w-48 h-48 border-2 border-blue-500 rounded-lg relative">
									{/* 모서리 표시 */}
									<div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-blue-500"></div>
									<div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-blue-500"></div>
									<div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-blue-500"></div>
									<div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-blue-500"></div>
								</div>
							</div>

							{/* 숨겨진 캔버스 */}
							<canvas
								ref={canvasRef}
								className="hidden"
							/>
						</div>

						<div className="text-sm text-gray-600">
							<p>QR 코드를 스캔 영역 안에 맞춰주세요</p>
							<p className="mt-1">카메라 권한을 허용해주세요</p>
						</div>

						<Button
							theme="dark"
							onClick={onClose}
							padding='px-4 py-2'
							fontSize='text-sm'
						>
							취소
						</Button>
					</div>
				)}
			</div>
		</Modal>
	);
};

export default QRScanner; 