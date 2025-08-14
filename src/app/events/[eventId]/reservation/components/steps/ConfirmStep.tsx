'use client'

import {motion} from "framer-motion";
import {textContainer, textContainerItem} from "@/types/ui/motionVariants";
import {EventWithCurrentStatus} from "@/types/dto/events";
import Counter from "@/components/base/Counter";
import Input from "@/components/base/Input";
import ThemeDiv from "@/components/base/ThemeDiv";
import dayjs from "dayjs";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import clsx from "clsx";
import ReservationSeatInfo from '@/app/events/[eventId]/components/ReservationSeatInfo';

interface ConfirmStepProps {
	event: EventWithCurrentStatus,
	quantity: number,
	onQuantityChange: (quantity: number) => void,
	ticketHolder: string,
	onTicketHolderChange: (value: string) => void,
	key?: string
}

const messages = [
	"예매 내용을 확인하고 수량과 예매자를 입력해주세요!",
];


const ConfirmStep = ({
	event,
	quantity,
	onQuantityChange,
	ticketHolder,
	onTicketHolderChange
}: ConfirmStepProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	
	return (
		<div className="relative">
			<motion.div
				variants={textContainer}
				initial="hidden"
				animate="visible"
				className={clsx(
					"flex flex-col text-sm md:text-base p-4 rounded-lg border mt-4",
					theme === "normal" 
						? "bg-gray-50 border-gray-200" 
						: theme === "dark"
						? "bg-gray-800 border-gray-700"
						: "bg-gray-800 border-gray-700"
				)}
			>
				{messages.map((msg, idx) => (
					<motion.p
						key={idx}
						variants={textContainerItem}
						className="whitespace-pre-line break-words"
					>
						{msg}
					</motion.p>
				))}
			</motion.div>

			<motion.div
				initial={{opacity: 0, y: 20}}
				animate={{opacity: 1, y: 0}}
				transition={{delay: 0.3, duration: 0.6}}
				className="mt-6 space-y-6"
			>
				<ThemeDiv isChildren className="rounded-lg p-4 md:p-6">
					<h3 className="text-lg md:text-xl font-semibold mb-4">
						공연 정보
					</h3>
					<div className="space-y-2 text-sm md:text-base">
						<div className="flex justify-between">
							<span className="opacity-70">공연명</span>
							<span className="font-medium">{event.eventName}</span>
						</div>
						<div className="flex justify-between">
							<span className="opacity-70">날짜</span>
							<span className="font-medium">
								{dayjs(event.eventDate).format('YYYY년 MM월 DD일 (ddd) HH:mm')}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="opacity-70">장소</span>
							<span className="font-medium">{event.location}</span>
						</div>
						<ReservationSeatInfo
							seatCapacity={event.seatCapacity}
							reservedQuantity={event.reservedQuantity}
							remainingQuantity={event.remainingQuantity}
							theme={theme}
						/>
					</div>
				</ThemeDiv>

				<ThemeDiv isChildren className="rounded-lg p-4 md:p-6">
					<h3 className="text-lg md:text-xl font-semibold mb-4">
						예매 정보
					</h3>
					<div className="space-y-4">
						<div>
							<div className="flex justify-between items-center mb-2">
								<label className="text-sm md:text-base font-medium opacity-70">
									예매 수량
								</label>
								<Counter
									value={quantity}
									onChange={onQuantityChange}
									min={1}
									max={event.remainingQuantity}
								/>
							</div>
							{event.remainingQuantity < quantity && (
								<p className={clsx(
									"text-xs md:text-sm opacity-90 mt-1",
									theme === "normal" ? "text-red-600" : "text-red-400"
								)}>
									잔여 좌석이 부족합니다. 수량을 조정해주세요.
								</p>
							)}
							{event.remainingQuantity <= 5 && event.remainingQuantity > 0 && (
								<p className={clsx(
									"text-xs md:text-sm opacity-90 mt-1",
									theme === "normal" ? "text-orange-600" : "text-orange-400"
								)}>
									잔여 좌석이 적습니다. 실시간으로 매진될 수 있어요.
								</p>
							)}
						</div>
						<div>
							<label className="block text-sm md:text-base font-medium opacity-70 mb-2">
								예매자
							</label>
							<Input
								value={ticketHolder}
								onChange={(e) => onTicketHolderChange(e.target.value)}
								placeholder="예매자를 입력해주세요"
								theme="dark"
								required
							/>
							<p className={clsx(
								"text-xs md:text-sm opacity-90 mt-2",
								theme === "normal" ? "text-red-600" : "text-red-400"
							)}>
								공연 당일 입장 시 확인받을 분의 이름을 입력해주세요.
							</p>
						</div>
					</div>
				</ThemeDiv>
			</motion.div>
		</div>
	);
};

export default ConfirmStep;