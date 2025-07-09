'use client';

import { useEffect, useRef, useState, useCallback, JSX } from 'react';
import useToast from '@/hooks/useToast';
import clsx from 'clsx';
import styles from "@/css/module/toast.module.css";
import ThemeDiv from "@/components/base/ThemeDiv";
import { CloseIcon } from "@/components/icon/CloseIcon";
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from "@/components/icon/AlertIcons";
import { IconType } from "@/types/ui/alert";
import { createPortal } from "react-dom";

const Toast = () => {
	const [isHovered, setIsHovered] = useState(false);

	const {
		isOpen,
		message,
		hideToast,
		iconType,
		autoCloseTime,
	} = useToast();

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
		const progress  = remaining / autoCloseTime;

		if (progressBarRef.current) {
			progressBarRef.current.style.width = `${progress * 100}%`;
		}

		if (progress  <= 0) {
			hideToast();
			startTimeRef.current = null;
			elapsedTimeRef.current = 0;
			if (progressBarRef.current) progressBarRef.current.style.width = '100%';
			return;
		}

		animationFrameRef.current = requestAnimationFrame(updateProgress);
	}, [autoCloseTime, hideToast]);

	const getIcon = (iconType: IconType): JSX.Element | null => {
		switch (iconType) {
			case 'success': return <SuccessIcon />
			case 'warning': return <WarningIcon />
			case 'error': return <ErrorIcon />
			case 'info': return <InfoIcon />
			default: return null;
		}
	}

	useEffect(() => {
		if (!isOpen || !autoCloseTime) return;

		if (isOpen && autoCloseTime) {
			if (!isHovered) {
				startTimeRef.current = Date.now();
				animationFrameRef.current = requestAnimationFrame(updateProgress);

				if (timeoutRef.current) clearTimeout(timeoutRef.current);
				timeoutRef.current = setTimeout(() => {
					hideToast();
					startTimeRef.current = null;
					elapsedTimeRef.current = 0;
					if (progressBarRef.current) {
						progressBarRef.current.style.width = '100%';
					}
				}, autoCloseTime - elapsedTimeRef.current);
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
	}, [isOpen, isHovered, autoCloseTime, hideToast, updateProgress]);

	useEffect(() => {
	}, [isOpen, message]);

	if (!isOpen) return null;

	return createPortal(
		<ThemeDiv
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onTouchStart={() => setIsHovered(true)}
			onTouchEnd={() => setIsHovered(false)}
			className={clsx(
				"fixed bottom-12 left-1/2 -translate-x-1/2 px-4 py-3 rounded shadow-lg w-[300px] z-50 md:w-[400px]",
				isOpen  ? styles["toast-enter-active"] : styles["toast-enter"]
			)}
			tabIndex={-1}
			isChildren
		>
			<div className="text-sm flex items-center md:text-base relative">
				<div className="w-6 h-6 flex-shrink-0 flex justify-center items-center m-1">
					{iconType && getIcon(iconType)}
				</div>

				<div className="break-words whitespace-normal break-normal pl-1">
					{message}
				</div>

				{!autoCloseTime && <div
					className={
						"absolute top-[50%] right-0 translate-y-[-50%] flex items-center cursor-pointer font-bold cursor-pointer shrink-0"
					}
					onClick={hideToast}
				>
					<CloseIcon />
				</div>}
			</div>
			{autoCloseTime &&
				<div className="w-full h-2 bg-gray-200 rounded overflow-hidden mt-2">
					<div
						ref={progressBarRef}
						className={clsx(styles["toast-progress-bar"], "rounded h-full")}
						style={{width: '100%'}} // 기본 100%
					/>
				</div>
			}
		</ThemeDiv>,
		document.body
	);
};

export default Toast;