'use client'

import { motion } from "framer-motion";
import { fadeSlideLeft } from "@/types/ui/motionVariants";
import { getStorageUrl } from "@/util/storage";
import clsx from "clsx";
import Skeleton from "@/components/base/Skeleton";
import Image from "next/image";
import { EventMedia } from "@/types/model/eventMedia";

interface EventPosterProps {
	eventName: string;
	posterData: EventMedia[] | undefined;
	theme: string;
	isLoading?: boolean;
	priority?: boolean;
	loading?: "eager" | "lazy";
	showPlaceholderText?: boolean;
	variant?: "detail" | "card";
	smallText?: boolean;
	overlay?: {
		title?: string;
		subtitle?: string;
		showOverlay?: boolean;
	};
}

const EventPoster = ({
	eventName,
	posterData,
	theme,
	isLoading = false,
	priority = false,
	loading,
	showPlaceholderText = false,
	variant = "detail",
	smallText = false,
	overlay,
}: EventPosterProps) => {
	const containerClass =
		variant === "card"
			? "w-full flex justify-center"
			: "relative w-full max-w-md md:w-80";

	const skeletonClass =
		variant === "card"
			? "w-full h-full rounded-lg"
			: "w-full h-80 rounded-lg";

	const aspectClass = (!posterData || posterData.length === 0) && variant !== "card" ? "" : "aspect-[4/5]";

	return (
		<motion.div
			variants={fadeSlideLeft}
			initial="hidden"
			animate="visible"
			transition={{ delay: 0.15 }}
			className="flex justify-center"
		>
			<div className={containerClass}>
				{isLoading ? (
					<div className={aspectClass + " w-full"}>
						<Skeleton className={skeletonClass} />
					</div>
				) : posterData && posterData.length > 0 ? (
					<div className="relative">
						<Image
							src={getStorageUrl(posterData[0].url)}
							alt={`${eventName} 포스터`}
							width={variant === "card" ? 400 : 320}
							height={variant === "card" ? 500 : 400}
							className={variant === "card" ? "w-full h-auto object-contain rounded-lg" : "w-full h-auto rounded-lg shadow-lg object-contain"}
							style={{ objectFit: "contain" }}
							priority={priority}
							loading={priority ? undefined : loading ?? "lazy"}
						/>
						{/* 오버레이 표시 */}
						{overlay?.showOverlay && (
							<div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-2 rounded-lg z-10">
								<div className="text-sm font-semibold text-white truncate text-center mb-1">
									{overlay.title}
								</div>
								<div className="text-xs text-white/90 text-center">
									{overlay.subtitle}
								</div>
							</div>
						)}
					</div>
				) : (
					<div className={aspectClass + " w-full relative"}>
						<div
							className={clsx(
								variant === "card"
									? "w-full h-full flex items-center justify-center border-2 border-dashed rounded-lg"
									: "w-full h-80 rounded-lg border-2 border-dashed flex items-center justify-center",
								theme === "normal"
									? "bg-gray-50 border-gray-200 text-gray-500"
									: "bg-gray-800 border-gray-700 text-gray-400"
							)}
						>
							<div className="text-center">
								<p className={smallText ? "text-xs font-medium mb-1" : "text-base font-medium mb-2"}>포스터 준비중</p>
								{showPlaceholderText ? (
									<p className={smallText ? "text-xs opacity-70" : "text-sm opacity-70"}>곧 업데이트될 예정입니다</p>
								) : null}
							</div>
						</div>
						{/* 대체 div에도 오버레이 표시 */}
						{overlay?.showOverlay && (
							<div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-2 rounded-lg z-10">
								<div className="text-sm font-semibold text-white truncate text-center mb-1">
									{overlay.title}
								</div>
								<div className="text-xs text-white/90 text-center">
									{overlay.subtitle}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default EventPoster; 