'use client'

import { motion } from "framer-motion";
import { textContainer, textContainerItem } from "@/types/ui/motionVariants";
import { EventWithCurrentStatus } from "@/types/dto/events";
import { PaymentAccount } from "@/types/model/paymentAccount";
import ThemeDiv from "@/components/base/ThemeDiv";
import Button from "@/components/base/Button";
import CheckCircleIcon from "@/components/icon/CheckCircleIcon";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import clsx from "clsx";
import dayjs from "dayjs";

interface PaymentStepProps {
	event: EventWithCurrentStatus;
	quantity: number;
	ticketHolder: string;
	paymentAccounts: PaymentAccount[];
	onGoToMyPage: () => void;
	eventId: string; // eventId 추가
}

const PaymentStep = ({
	event,
	quantity,
	ticketHolder,
	paymentAccounts,
	onGoToMyPage,
	eventId
}: PaymentStepProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	
	const totalAmount = event.ticketPrice * quantity;
	
	// 마이페이지로 이동 시 localStorage 정리
	const handleGoToMyPage = () => {
		// 예매 완료 상태 제거
		localStorage.removeItem(`reservation_${eventId}`);
		// 마이페이지로 이동
		onGoToMyPage();
	};
	
	return (
		<div className="relative">
			{/* 성공 메시지 */}
			<motion.div
				variants={textContainer}
				initial="hidden"
				animate="visible"
				className={clsx(
					"flex flex-col items-center text-center p-6 rounded-xl border-2 mb-6 mt-4",
					theme === "normal" 
						? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm" 
						: theme === "dark"
						? "bg-gradient-to-br from-blue-950/30 to-indigo-950/30 border-blue-600/50 shadow-lg"
						: "bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border-blue-500/50 shadow-lg"
				)}
			>
				<motion.div
					variants={textContainerItem}
					className={clsx(
						"w-12 h-12 rounded-full flex items-center justify-center mb-4",
						theme === "normal"
							? "bg-gradient-to-br from-blue-500 to-indigo-500"
							: "bg-gradient-to-br from-blue-500 to-indigo-500"
					)}
				>
					<CheckCircleIcon className="w-8 h-8 text-white" />
				</motion.div>
				
				<motion.h2
					variants={textContainerItem}
					className={clsx(
						"text-xl md:text-2xl font-bold mb-2",
						theme === "normal" ? "text-blue-800" : "text-blue-100"
					)}
				>
					예매 완료!
				</motion.h2>
				
				<motion.p
					variants={textContainerItem}
					className={clsx(
						"text-sm md:text-base",
						theme === "normal" ? "text-blue-600" : "text-blue-200"
					)}
				>
					아래 정보 확인 후 이체해주세요!
				</motion.p>
			</motion.div>

			<div className="space-y-5">
				{/* 예매 정보 요약 */}
				<ThemeDiv isChildren className="rounded-lg p-4">
					<motion.h3
						variants={textContainerItem}
						className="text-lg font-medium mb-3"
					>
						예매 정보
					</motion.h3>
					<div className="space-y-2 text-sm">
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
							<span className="opacity-70">예매자</span>
							<span className="font-medium">{ticketHolder}</span>
						</div>
						<div className="flex justify-between">
							<span className="opacity-70">수량</span>
							<span className="font-medium">{quantity}매</span>
						</div>
						<div className="flex justify-between">
							<span className="opacity-70">총 금액</span>
							<span className="font-semibold text-base">
								{totalAmount.toLocaleString()}원
							</span>
						</div>
					</div>
				</ThemeDiv>

				{/* 입금 계좌 정보 */}
				<ThemeDiv isChildren className="rounded-lg p-4">
					<h3 className="text-base font-semibold mb-3">
						입금 계좌 정보
					</h3>
					{paymentAccounts.map((account, index) => (
						<div key={account.id} className="space-y-3">
							{index > 0 && (
								<div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
									<p className="text-xs opacity-50 text-center">또는</p>
								</div>
							)}
							<div className="space-y-2">
								<div className="flex justify-between items-center">
									<span className="opacity-70 text-sm">은행</span>
									<span className="font-medium text-sm">{account.bankName}</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="opacity-70 text-sm">계좌번호</span>
									<span className="font-medium font-mono text-sm">{account.accountNumber}</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="opacity-70 text-sm">예금주</span>
									<span className="font-medium text-sm">{account.accountHolder}</span>
								</div>
								{account.description && (
									<div className={`mt-3 p-3 rounded-lg ${
										theme === 'normal' 
											? 'bg-amber-50 border border-amber-200' 
											: theme === 'neon'
											? 'bg-amber-950/20 border border-amber-400/50'
											: 'bg-amber-950/30 border border-amber-800/50'
									}`}>
										<p className={`text-xs ${
											theme === 'normal'
												? 'text-amber-800'
												: theme === 'neon'
												? 'text-amber-200'
												: 'text-amber-200'
										}`}>
											{account.description}
										</p>
									</div>
								)}
							</div>
						</div>
					))}
				</ThemeDiv>

				{/* 주의사항 */}
				<ThemeDiv isChildren className="rounded-lg p-4">
					<h3 className="text-base font-semibold mb-3">
						입금 시 주의사항
					</h3>
					<div className="space-y-2 text-sm">
						<div className="flex items-start space-x-2">
							<span className="text-red-500 font-bold text-xs">•</span>
							<span>입금자명을 <strong>{ticketHolder}</strong>으로 해주세요</span>
						</div>
						<div className="flex items-start space-x-2">
							<span className="text-red-500 font-bold text-xs">•</span>
							<span>입금 확인 후 1-2일 내에 관리자 승인이 완료됩니다</span>
						</div>
						<div className="flex items-start space-x-2">
							<span className="text-red-500 font-bold text-xs">•</span>
							<span>입금 확인 전까지는 예매가 확정되지 않습니다</span>
						</div>
						<div className="flex items-start space-x-2">
							<span className="text-blue-500 font-bold text-xs">•</span>
							<span>입금 계좌 정보는 마이페이지에서 다시 확인할 수 있어요</span>
						</div>
					</div>
				</ThemeDiv>
			</div>

			{/* 마이페이지로 이동 버튼 */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5, duration: 0.6 }}
				className="mt-6"
			>
				<Button
					theme="dark"
					width="w-full"
					fontSize="text-base"
					padding="px-2 py-1.5"
					onClick={handleGoToMyPage}
					reverse={theme === "normal"}
				>
					마이페이지로 이동
				</Button>
			</motion.div>
		</div>
	);
};

export default PaymentStep;
