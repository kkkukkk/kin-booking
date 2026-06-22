'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import Logo from '@/components/Logo';
import ThemeDiv from '@/components/base/ThemeDiv';
import AnimatedText from '@/components/base/AnimatedText';

const MaintenanceClient = () => {
	const theme = useAppSelector((state: RootState) => state.theme.current);

	return (
		<main className="main-center center p-4">
			<ThemeDiv className="w-full max-w-md p-8 rounded-lg text-center" isChildren>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div className="mb-6 flex justify-center">
						<Logo width={280} priority />
					</div>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.5 }}
					>
						<div
							className={clsx(
								'text-2xl font-bold mb-3',
								theme === 'normal' ? 'text-gray-800' : 'text-gray-100',
							)}
						>
							<AnimatedText text="준비 중입니다" fontSize="text-2xl font-bold" delay={0.1} />
						</div>
						<p
							className={clsx(
								'text-base mb-6 leading-relaxed',
								theme === 'normal' ? 'text-gray-600' : 'text-gray-300',
							)}
						>
							더 나은 서비스를 위해 잠시 점검 중이에요.
							<br />
							곧 다시 찾아뵙겠습니다.
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4, duration: 0.5 }}
						className={clsx(
							'p-3 rounded-lg text-sm',
							theme === 'normal'
								? 'bg-gray-50 text-gray-500 border border-gray-200'
								: 'bg-gray-800/30 text-gray-400 border border-gray-700',
						)}
					>
						<p>잠시만 기다려 주세요.</p>
					</motion.div>
				</motion.div>
			</ThemeDiv>
		</main>
	);
};

export default MaintenanceClient;
