'use client'

import { EventMedia } from "@/types/model/eventMedia";
import EventPoster from "./EventPoster";

interface EventPosterWrapperProps {
	eventName: string;
	posterData: EventMedia[] | undefined;
	theme: string;
	isLoading?: boolean;
	priority?: boolean;
	loading?: "eager" | "lazy";
	showPlaceholderText?: boolean;
	variant?: "detail" | "card" | "hero" | "small";
	smallText?: boolean;
	overlay?: {
		title?: string;
		subtitle?: string;
		showOverlay?: boolean;
	};
}

const EventPosterWrapper = ({
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
}: EventPosterWrapperProps) => {
	// 컨테이너 크기 설정
	const containerSize = variant === "small"
		? "w-full h-full" // small은 부모 컨테이너에 맞춤
		: variant === "card"
		? "w-full min-h-[200px] md:min-h-[240px] aspect-[602/852]" // card는 실제 포스터 비율
		: variant === "hero"
		? "w-full h-full" // hero도 부모 컨테이너에 맞춤
		: variant === "detail"
		? "w-full h-full" // detail은 부모 컨테이너에 맞춤 (부모에서 aspect ratio 설정)
		: "w-full h-full";

	return (
		<div className={`relative ${containerSize}`}>
			<EventPoster
				eventName={eventName}
				posterData={posterData}
				theme={theme}
				isLoading={isLoading}
				priority={priority}
				loading={loading}
				showPlaceholderText={showPlaceholderText}
				smallText={smallText}
			/>
			{/* 오버레이 표시 */}
			{overlay?.showOverlay && (
				<div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-2 rounded z-10">
					<div className="text-sm font-semibold text-white truncate text-center mb-1">
						{overlay.title}
					</div>
					<div className="text-xs text-white/90 text-center">
						{overlay.subtitle}
					</div>
				</div>
			)}
		</div>
	);
};

export default EventPosterWrapper; 