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
	smallText?: boolean;
}

const EventPoster = ({
	eventName,
	posterData,
	theme,
	isLoading = false,
	priority = false,
	loading,
	showPlaceholderText = false,
	smallText = false,
}: EventPosterProps) => {
	return (
		<motion.div
			variants={fadeSlideLeft}
			initial="hidden"
			animate="visible"
			transition={{ delay: 0.15 }}
			className="w-full h-full"
		>
			{isLoading ? (
				<Skeleton className="w-full h-full rounded-lg" />
			) : posterData && posterData.length > 0 ? (
				<div className="relative w-full h-full">
					<Image
						src={getStorageUrl(posterData[0].url)}
						alt={`${eventName} 포스터`}
						width={400}
						height={500}
						className="w-full h-full object-cover rounded"
						priority={priority}
						loading={priority ? undefined : loading ?? "lazy"}
					/>
				</div>
			) : (
				<div className="relative w-full h-full">
					<div
						className={clsx(
							"w-full h-full flex items-center justify-center border-2 border-dashed rounded",
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
				</div>
			)}
		</motion.div>
	);
};

export default EventPoster; 