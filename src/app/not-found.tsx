'use client'

import Link from "next/link";
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import Button from '@/components/base/Button';
import ThemeDiv from '@/components/base/ThemeDiv';
import { motion } from 'framer-motion';
import { HomeIcon } from '@/components/icon/HomeIcon';
import { SearchIcon } from '@/components/icon/FriendIcons';
import clsx from 'clsx';

const NotFound = () => {
	const theme = useAppSelector((state: RootState) => state.theme.current);

	return (
		<main className="main-center center p-4">
			<ThemeDiv className="w-full max-w-md p-8 rounded-lg text-center" isChildren>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					{/* 404 아이콘 */}
					<div className="mb-6">
						<div className={clsx(
							"relative mx-auto w-24 h-24 mb-4",
							theme === "normal" && "text-gray-500",
							theme === "dark" && "text-gray-400",
							theme === "neon" && "text-gray-300"
						)}>
							{/* 배경 원 */}
							<div className={clsx(
								"absolute inset-0 rounded-full opacity-20",
								theme === "normal" ? "bg-gray-100" : "bg-gray-900/30"
							)}></div>
							{/* 404 텍스트 */}
							<div className={clsx(
								"absolute inset-2 rounded-full flex items-center justify-center font-bold text-2xl",
								theme === "normal" ? "bg-gray-50" : "bg-gray-900/20"
							)}>
								404
							</div>
						</div>
					</div>

					{/* 메시지 */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.5 }}
					>
						<h1 className={clsx(
							"text-2xl font-bold mb-3",
							theme === "normal" ? "text-gray-800" : "text-gray-100"
						)}>
							페이지를 찾을 수 없어요
						</h1>
						<p className={clsx(
							"text-base mb-6 leading-relaxed",
							theme === "normal" ? "text-gray-600" : "text-gray-300"
						)}>
							요청하신 페이지가 존재하지 않거나<br />
							이동되었습니다.
						</p>
					</motion.div>

					{/* 버튼들 */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.5 }}
						className="space-y-3"
					>
						<Link href="/" className="block">
							<Button
								theme={theme}
								className="w-full flex items-center justify-center gap-2"
								padding="px-6 py-3"
								fontSize="text-base"
								fontWeight="font-semibold"
							>
								<HomeIcon className="w-5 h-5" />
								홈으로 돌아가기
							</Button>
						</Link>
						
						<Button
							onClick={() => window.history.back()}
							theme={theme}
							reverse={theme === 'normal'}
							light={true}
							className="w-full flex items-center justify-center gap-2"
							padding="px-6 py-3"
							fontSize="text-base"
							fontWeight="font-medium"
						>
							<SearchIcon className="w-5 h-5" />
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
							URL을 다시 한 번 확인해보세요.
						</p>
					</motion.div>
				</motion.div>
			</ThemeDiv>
		</main>
	);
};

export default NotFound;