'use client';

import React, { useEffect, useRef, useState } from 'react';
import useAlert from '@/hooks/useAlert';
import clsx from 'clsx';
import styles from "@/css/module/alert.module.css";
import ThemeDiv from "@/components/base/ThemeDiv";

const Toast = () => {
	const [isHovered, setIsHovered] = useState(false);
	const [showAnimation, setShowAnimation] = useState(false);

	const {
		isOpen,
		message,
		hideAlert,
		autoCloseTime,
	} = useAlert();

	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const startTimeRef = useRef<number | null>(null);
	const elapsedTimeRef = useRef<number>(0);
	const animationFrameRef = useRef<number | null>(null);
	const progressBarRef = useRef<HTMLDivElement>(null);

	// 진행률 애니메이션 업데이트 (ref로 직접 스타일 조작)
	const updateProgress = () => {
		if (!startTimeRef.current || !autoCloseTime) return;

		const now = Date.now();
		const elapsed = elapsedTimeRef.current + (now - startTimeRef.current);
		const remaining = Math.max(autoCloseTime - elapsed, 0);
		const newProgress = remaining / autoCloseTime;

		if (progressBarRef.current) {
			progressBarRef.current.style.width = `${newProgress * 100}%`;
		}

		if (newProgress <= 0) {
			hideAlert();
			startTimeRef.current = null;
			elapsedTimeRef.current = 0;
			if (progressBarRef.current) {
				progressBarRef.current.style.width = '100%';
			}
			return; // 애니메이션 종료
		}

		animationFrameRef.current = requestAnimationFrame(updateProgress);
	};

	useEffect(() => {
		if (isOpen) {
			setShowAnimation(true);
		} else {
			setShowAnimation(false);
		}
	}, [isOpen]);

	// isOpen 또는 isHovered 변경 시 애니메이션 시작/중지 제어
	useEffect(() => {
		if (isOpen && autoCloseTime) {
			if (!isHovered) {
				startTimeRef.current = Date.now();
				animationFrameRef.current = requestAnimationFrame(updateProgress);

				// 남은 시간 계산 후 타이머 설정 (마우스 오버 시 clear)
				const remainingTime = autoCloseTime - elapsedTimeRef.current;
				if (timeoutRef.current) clearTimeout(timeoutRef.current);
				timeoutRef.current = setTimeout(() => {
					hideAlert();
					startTimeRef.current = null;
					elapsedTimeRef.current = 0;
					if (progressBarRef.current) {
						progressBarRef.current.style.width = '100%';
					}
				}, remainingTime);
			} else {
				// 마우스 올렸을 때 경과 시간 저장 후 애니메이션/타이머 정지
				if (startTimeRef.current) {
					elapsedTimeRef.current += Date.now() - startTimeRef.current;
					startTimeRef.current = null;
				}
				if (timeoutRef.current) clearTimeout(timeoutRef.current);
				if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
			}
		}

		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
		};
	}, [isOpen, isHovered, autoCloseTime, hideAlert]);

	if (!isOpen) return null;

	return (
		<ThemeDiv
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onTouchStart={() => setIsHovered(true)}
			onTouchEnd={() => setIsHovered(false)}
			className={clsx(
				"fixed bottom-8 left-1/2 -translate-x-1/2 bg-white px-4 py-3 rounded shadow-lg w-[300px] z-50",
				showAnimation ? styles["toast-enter-active"] : styles["toast-enter"]
			)}
		>
			<p className="text-sm text-gray-800 mb-2">{message}</p>
			<div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
				<div
					ref={progressBarRef}
					className={clsx(
						styles["toast-progress-bar"], "rounded h-full bg-blue-500"
					)}
					style={{ width: '100%' }} // 기본 100%
				/>
			</div>
		</ThemeDiv>
	);
};

export default Toast;