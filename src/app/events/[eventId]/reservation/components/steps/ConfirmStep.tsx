'use client'

import {motion} from "framer-motion";
import {textContainer, textContainerItem} from "@/types/ui/motionVariants";
import {EventWithCurrentStatus} from "@/types/dto/events";
import Counter from "@/components/base/Counter";
import Input from "@/components/base/Input";
import ThemeDiv from "@/components/base/ThemeDiv";
import dayjs from "dayjs";

interface ConfirmStepProps {
	event: EventWithCurrentStatus,
	quantity: number,
	onQuantityChange: (quantity: number) => void,
	ticketHolder: string,
	onTicketHolderChange: (value: string) => void,
	key?: string
}

const ConfirmStep = ({
	event,
	quantity,
	onQuantityChange,
	ticketHolder,
	onTicketHolderChange
}: ConfirmStepProps) => {
	const messages = [
		"예매 내용을 확인하고 수량과 예매자를 입력해주세요!",
	];

	return (
		<div className="relative overflow-hidden">
			<motion.div
				variants={textContainer}
				initial="hidden"
				animate="visible"
				className="flex flex-col space-y-3 text-sm md:text-base"
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
				className="mt-8 md:mt-10 space-y-6"
			>
				{/* 공연 정보 */}
				<ThemeDiv isChildren className="rounded-lg p-4 md:p-6">
					<h3 className="text-lg md:text-xl font-semibold mb-4">
						공연 정보
					</h3>
					<div className="space-y-2 text-sm md:text-base">
						<div className="flex justify-between">
							<span className="opacity-70">공연명</span>
							<span className="font-semibold">{event.eventName}</span>
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
						<div className="flex justify-between">
							<span className="opacity-70">잔여 좌석</span>
							<span className="font-medium">{event.remainingQuantity}석</span>
						</div>
					</div>
				</ThemeDiv>

				{/* 예매 정보 입력 */}
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
							<p className="text-xs md:text-sm opacity-60 mt-2">
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