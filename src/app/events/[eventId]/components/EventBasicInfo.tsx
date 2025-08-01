'use client'

import dayjs from "dayjs";
import { LocationIcon } from "@/components/icon/LocationIcon";
import clsx from "clsx";

interface EventBasicInfoProps {
	eventDate: string;
	location: string;
	ticketPrice: number;
	theme: string;
}

const EventBasicInfo = ({ eventDate, location, ticketPrice, theme }: EventBasicInfoProps) => {
	return (
		<div className="space-y-3">
			<div>
				<p className="text-sm md:text-base opacity-70">공연 날짜</p>
				<p className="text-xs md:text-sm font-medium">
					{dayjs(eventDate).format("YYYY년 MM월 DD일 HH:mm")}
				</p>
			</div>

			<div>
				<p className="text-sm md:text-base opacity-70">장소</p>
				<div className="flex items-center space-x-2">
					<p className="text-xs md:text-sm font-medium break-words whitespace-normal">{location}</p>
					<a
						href={`https://map.kakao.com/link/search/${encodeURIComponent(location)}`}
						target="_blank"
						rel="noopener noreferrer"
						className={clsx(
							"inline-flex items-center space-x-1 px-2 py-1 rounded text-xs md:text-sm transition-colors border",
							theme === "normal"
								? "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300 hover:border-blue-500"
								: "bg-blue-900/30 text-blue-300 hover:bg-blue-900/50 border-blue-600 hover:border-blue-400"
						)}
					>
						<LocationIcon className="w-4 h-4"/>
						<span className="whitespace-nowrap">카카오맵</span>
					</a>
				</div>
			</div>

			<div>
				<p className="text-sm md:text-base opacity-70">티켓 가격</p>
				<p className="text-xs md:text-sm font-medium">
					{ticketPrice.toLocaleString()}원
				</p>
			</div>
		</div>
	);
};

export default EventBasicInfo;