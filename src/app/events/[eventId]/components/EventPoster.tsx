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
}

const EventPoster = ({ eventName, posterData, theme, isLoading = false }: EventPosterProps) => {
	if (isLoading) {
		return (
			<motion.div
				variants={fadeSlideLeft}
				initial="hidden"
				animate="visible"
				transition={{ delay: 0.15 }}
				className="flex justify-center"
			>
				<div className="relative w-full max-w-md md:w-80">
					<Skeleton className="w-full h-80 rounded-lg" />
				</div>
			</motion.div>
		);
	}

	return (
		<motion.div
			variants={fadeSlideLeft}
			initial="hidden"
			animate="visible"
			transition={{ delay: 0.15 }}
			className="flex justify-center"
		>
			<div className="relative w-full max-w-md md:w-80">
				{posterData && posterData.length > 0 ? (
					<Image
						src={getStorageUrl(posterData[0].url)}
						alt={`${eventName} 포스터`}
						width={320}
						height={320}
						className="w-full h-auto rounded-lg shadow-lg"
						style={{ objectFit: 'cover' }}
						loading="lazy"
						priority
					/>
				) : (
					<div className={clsx(
						"w-full h-80 rounded-lg border-2 border-dashed flex items-center justify-center",
						theme === "normal" 
							? "bg-gray-50 border-gray-200 text-gray-500" 
							: "bg-gray-800 border-gray-700 text-gray-400"
					)}>
						<div className="text-center">
							<p className="text-lg font-medium mb-2">포스터 준비중</p>
							<p className="text-sm opacity-70">곧 업데이트될 예정입니다</p>
						</div>
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default EventPoster; 