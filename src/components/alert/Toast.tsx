'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
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

	const updateProgress = useCallback(() => {
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
			return;
		}

		animationFrameRef.current = requestAnimationFrame(updateProgress);
	}, [autoCloseTime, hideAlert]);

	useEffect(() => {
		if (isOpen) {
			setShowAnimation(true);
		} else {
			setShowAnimation(false);
		}
	}, [isOpen]);

	useEffect(() => {
		if (isOpen && autoCloseTime) {
			if (!isHovered) {
				startTimeRef.current = Date.now();
				animationFrameRef.current = requestAnimationFrame(updateProgress);

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
	}, [isOpen, isHovered, autoCloseTime, hideAlert, updateProgress]);

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
			<div className="text-sm flex justify-between items-center">
				{message}
				{!autoCloseTime && <div
					className={
						"flex items-center cursor-pointer font-bold"
					}
					onClick={hideAlert}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
					     className="bi bi-x-lg" viewBox="0 0 16 16">
						<path
							d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
					</svg>
				</div>}
			</div>
			{autoCloseTime && <div className="w-full h-2 bg-gray-200 rounded overflow-hidden mt-2">
							<div
								ref={progressBarRef}
								className={clsx(
					styles["toast-progress-bar"], "rounded h-full"
				)}
								style={{width: '100%'}} // 기본 100%
							/>
						</div>}
		</ThemeDiv>
	);
};

export default Toast;