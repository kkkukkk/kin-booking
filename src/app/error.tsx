'use client'

import { useRouter } from "next/navigation";
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import Button from '@/components/base/Button';
import ThemeDiv from '@/components/base/ThemeDiv';
import { motion } from 'framer-motion';
import { HomeIcon } from '@/components/icon/HomeIcon';
import { ErrorIcon } from '@/components/icon/AlertIcons';
import clsx from 'clsx';

const ErrorPage = () => {
	const router = useRouter();
	const theme = useAppSelector((state: RootState) => state.theme.current);

	const handleGoHome = () => {
		router.push('/');
	};

	const handleGoBack = () => {
		router.back();
	};

	return (
		<main className="main-center flex flex-col justify-center items-center p-4">
			<ThemeDiv className="w-full max-w-md p-8 rounded-lg text-center" isChildren>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					{/* 에러 아이콘 */}
					<div className="mb-6">
						<div className={clsx(
							"relative mx-auto w-20 h-20 mb-4",
							theme === "normal" && "text-red-500",
							theme === "dark" && "text-red-400",
							theme === "neon" && "text-red-400"
						)}>
							{/* 배경 원 */}
							<div className={clsx(
								"absolute inset-0 rounded-full opacity-20",
								theme === "normal" ? "bg-red-100" : "bg-red-900/30"
							)}></div>
							{/* 아이콘 */}
							<div className={clsx(
								"absolute inset-2 rounded-full flex items-center justify-center",
								theme === "normal" ? "bg-red-50" : "bg-red-900/20"
							)}>
								<ErrorIcon />
							</div>
						</div>
					</div>

					{/* 에러 메시지 */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.5 }}
					>
						<h1 className={clsx(
							"text-2xl font-bold mb-3",
							theme === "normal" ? "text-gray-800" : "text-gray-100"
						)}>
							앗! 문제가 발생했어요
						</h1>
						<p className={clsx(
							"text-base mb-6 leading-relaxed",
							theme === "normal" ? "text-gray-600" : "text-gray-300"
						)}>
							예상치 못한 오류가 발생했습니다.<br />
							잠시 후 다시 시도해주세요.
						</p>
					</motion.div>

					{/* 버튼들 */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.5 }}
						className="space-y-3"
					>
						<Button
							onClick={handleGoHome}
							theme={theme}
							className="w-full flex items-center justify-center gap-2"
							padding="px-6 py-3"
							fontSize="text-base"
							fontWeight="font-semibold"
						>
							<HomeIcon className="w-5 h-5" />
							홈으로 돌아가기
						</Button>
						
						<Button
							onClick={handleGoBack}
							theme={theme}
							reverse={theme === 'normal'}
							light={true}
							className="w-full"
							padding="px-6 py-3"
							fontSize="text-base"
							fontWeight="font-medium"
						>
							이전 페이지로
						</Button>
					</motion.div>

					{/* 추가 안내 */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.6, duration: 0.5 }}
						className={clsx(
							"mt-6 p-3 rounded-lg text-sm",
							theme === "normal" 
								? "bg-gray-50 text-gray-500 border border-gray-200"
								: "bg-gray-800/30 text-gray-400 border border-gray-700"
						)}
					>
						<p>
							문제가 지속되면 관리자에게 문의해주세요.
						</p>
					</motion.div>
				</motion.div>
			</ThemeDiv>
		</main>
	);
};

export default ErrorPage;