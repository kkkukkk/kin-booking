import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'KIN — 준비 중',
	description: 'KIN 공연 예매 사이트를 준비하고 있습니다.',
	robots: { index: false, follow: false },
};

const MaintenancePage = () => {
	return (
		<main className="min-h-[var(--vh,100vh)] flex flex-col items-center justify-center gap-6 px-6 py-12 text-center">
			<Image
				src="/images/logo_normal.png"
				alt="KIN"
				width={280}
				height={205}
				priority
				className="w-auto h-auto max-w-[min(280px,70vw)]"
			/>
			<div className="flex flex-col gap-3 max-w-md">
				<h1 className="text-2xl md:text-3xl font-bold tracking-tight">준비 중입니다</h1>
				<p className="text-base md:text-lg text-gray-600 leading-relaxed">
					더 나은 서비스를 위해 잠시 점검 중이에요.
					<br />
					곧 다시 찾아뵙겠습니다.
				</p>
			</div>
		</main>
	);
};

export default MaintenancePage;
