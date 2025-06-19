'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from '@/css/module/scroll-bar.module.css';
import clsx from 'clsx';
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

interface ScrollBarProps {
	targetRef: React.RefObject<HTMLElement | null>;
	height?: string;
}

const ScrollBar: React.FC<ScrollBarProps> = ({ targetRef }) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const [thumbHeight, setThumbHeight] = useState(0);
	const [thumbTop, setThumbTop] = useState(0);
	const [dragging, setDragging] = useState(false);
	const [trackTop, setTrackTop] = useState(0);
	const [trackHeight, setTrackHeight] = useState(0);
	const [rightOffset, setRightOffset] = useState(0);
	const REDUCED_RATIO = 0.98;

	const dragStartY = useRef(0);
	const dragStartTop = useRef(0);

	const updateTrackPosition = useCallback(() => {
		if (!targetRef.current) return;
		const rect = targetRef.current.getBoundingClientRect();
		setTrackTop(rect.top);
		setTrackHeight(rect.height);

		const rightSpace = window.innerWidth - (rect.left + rect.width);
		setRightOffset(rightSpace);
	}, [targetRef]);

	const updateThumb = useCallback(() => {
		if (!targetRef.current) return;
		const target = targetRef.current;
		const { scrollTop, scrollHeight, clientHeight } = target;

		const adjustedClientHeight = clientHeight * REDUCED_RATIO;
		const ratio = adjustedClientHeight / scrollHeight;
		const newThumbHeight = Math.max(ratio * adjustedClientHeight, 20);
		setThumbHeight(newThumbHeight);

		const reducedTrackHeight = trackHeight * REDUCED_RATIO;
		const maxThumbTop = reducedTrackHeight - newThumbHeight;
		const maxScrollTop = scrollHeight - clientHeight;
		const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

		const newThumbTop = isAtBottom
			? maxThumbTop
			: Math.round((scrollTop / maxScrollTop) * maxThumbTop);

		setThumbTop(newThumbTop);
	}, [targetRef, trackHeight]);

	useEffect(() => {
		if (!targetRef.current) return;

		updateTrackPosition();
		updateThumb();

		const resizeObserver = new ResizeObserver(() => {
			updateTrackPosition();
			updateThumb();
		});
		resizeObserver.observe(targetRef.current);

		const target = targetRef.current;
		target.addEventListener('scroll', updateThumb);
		window.addEventListener('resize', updateThumb);

		return () => {
			resizeObserver.disconnect();
			target.removeEventListener('scroll', updateThumb);
			window.removeEventListener('resize', updateThumb);
		};
	}, [targetRef, updateTrackPosition, updateThumb]);

	const onMouseDown = (e: React.MouseEvent) => {
		setDragging(true);
		dragStartY.current = e.clientY;
		dragStartTop.current = thumbTop;
		document.body.style.userSelect = 'none';
	};

	const onMouseMove = useCallback((e: MouseEvent) => {
		if (!dragging || !targetRef.current) return;
		const target = targetRef.current;

		const deltaY = e.clientY - dragStartY.current;
		const reducedTrackHeight = trackHeight * REDUCED_RATIO;
		const newTop = Math.min(
			Math.max(dragStartTop.current + deltaY, 0),
			reducedTrackHeight - thumbHeight
		);

		const scrollRatio = newTop / (reducedTrackHeight - thumbHeight);
		target.scrollTop = scrollRatio * (target.scrollHeight - target.clientHeight);
	}, [dragging, targetRef, trackHeight, thumbHeight]);

	const onMouseUp = useCallback(() => {
		if (dragging) {
			setDragging(false);
			document.body.style.userSelect = '';
		}
	}, [dragging]);

	useEffect(() => {
		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
		return () => {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
		};
	}, [onMouseMove, onMouseUp]);

	const reducedHeight = trackHeight * REDUCED_RATIO;
	const topOffset = (trackHeight - reducedHeight) / 2;

	return (
		<div
			className={clsx(styles['scrollbarTrack'], 'w-1 md:w-2')}
			style={{
				position: 'fixed',
				top: trackTop + topOffset,
				right: rightOffset + 10,
				height: reducedHeight,
				zIndex: 9999,
			}}
		>
			<div
				className={clsx(
					styles['scrollbarThumb'],
					{
						[styles['dragging']]: dragging,
					},
					theme && styles[theme],
					'w-1 md:w-2'
				)}
				style={{
					height: thumbHeight,
					top: thumbTop,
					position: 'absolute',
					backgroundColor: '#888888',
					transition: dragging ? 'none' : 'top 0.1s',
				}}
				onMouseDown={onMouseDown}
			/>
		</div>
	);
};

export default ScrollBar;