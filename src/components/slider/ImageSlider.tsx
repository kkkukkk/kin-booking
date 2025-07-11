'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import Skeleton from "@/components/base/Skeleton";
import clsx from "clsx";

interface ImageSliderProps {
	images: string[];
	interval?: number;
	width?: string;
	height?: string;
	priority?: boolean;
	noRounded?: boolean;
}

const ImageSlider = ({
	images,
	interval = 5000,
	width = "w-full",
	height = "h-full",
	priority = false,
	noRounded = false,
}: ImageSliderProps) => {
	const [current, setCurrent] = useState(0);
	const [imageError, setImageError] = useState<number | null>(null);
	const [isTransitioning, setIsTransitioning] = useState(false);

	// useEffect는 항상 컴포넌트 최상위에서 호출
	useEffect(() => {
		if (!images || images.length === 0) return;
		const id = setInterval(() => {
			setIsTransitioning(true);
			setTimeout(() => {
				setCurrent((prev) => (prev + 1) % images.length);
				setIsTransitioning(false);
			}, 500); // 전환 시간의 절반
		}, interval);
		return () => clearInterval(id);
	}, [images.length, interval, images]);

	// 빈 배열이나 유효하지 않은 이미지 처리
	if (!images || images.length === 0) {
		return <Skeleton width={width} height={height} className={clsx(!noRounded && 'rounded')} />;
	}

	// 이미지 로드 에러 처리
	const handleImageError = (index: number) => {
		setImageError(index);
	};

	// 현재 이미지와 다음 이미지만 렌더링 (성능 최적화)
	const currentImage = images[current];
	const nextIndex = (current + 1) % images.length;
	const nextImage = images[nextIndex];

	return (
		<div className={clsx(
			'relative overflow-hidden',
			width,
			height,
			!noRounded && 'rounded'
		)}>
			<Image
				key={`current-${current}`}
				src={currentImage}
				alt={`slide-${current}`}
				fill
				className={`object-cover transition-opacity duration-1000 ease-in-out ${
					isTransitioning ? 'opacity-0' : 'opacity-100'
				}`}
				onError={() => handleImageError(current)}
				priority={priority}
			/>
			
			{nextImage && (
				<Image
					key={`next-${nextIndex}`}
					src={nextImage}
					alt={`slide-${nextIndex}`}
					fill
					className={`object-cover transition-opacity duration-1000 ease-in-out ${
						isTransitioning ? 'opacity-100' : 'opacity-0'
					}`}
					onError={() => handleImageError(nextIndex)}
				/>
			)}

			{imageError !== null && (
				<Skeleton width="w-full" height="h-full" className="absolute inset-0" />
			)}
		</div>
	);
};

export default ImageSlider;
