'use client'

import { motion } from "framer-motion";
import Button from "@/components/base/Button";
import { ErrorIcon } from "@/components/icon/AlertIcons";
import AnimatedText from "@/components/base/AnimatedText";

interface EventErrorProps {
	theme: string;
	onRetry: () => void;
	onGoToList: () => void;
}

const EventError = ({ theme, onRetry, onGoToList }: EventErrorProps) => {
	return (
		<div className="h-full flex items-center justify-center p-4">
			<div className="text-center max-w-md">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="space-y-6"
				>
					{/* 에러 아이콘 */}
					<div className="flex justify-center">
						<div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
							<div className="transform scale-180 text-red-400">
								<ErrorIcon />
							</div>
						</div>
					</div>

					{/* 에러 메시지 */}
					<div className="space-y-3">
						<AnimatedText
							fontSize="text-xl md:text-2xl"
							text="공연 정보를 불러올 수 없어요"
						/>

						<AnimatedText
							fontSize="text-sm md:text-base"
							text="잠시 후 다시 시도해주세요!"
							delay={0.8}
						/>
					</div>

					{/* 액션 버튼들 */}
					<div className="space-y-3 pt-4">
						<Button
							theme="dark"
							width="w-full"
							padding="px-6 py-3"
							onClick={onRetry}
							reverse={theme === "normal"}
							light={theme !== "normal"}
						>
							다시 시도
						</Button>

						<Button
							theme="normal"
							width="w-full"
							padding="px-6 py-3"
							onClick={onGoToList}
							reverse={theme === "normal"}
							light={theme !== "normal"}
						>
							공연 목록으로
						</Button>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default EventError; 