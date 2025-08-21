'use client'

import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import Accordion from '@/components/base/Accordion';
import clsx from 'clsx';

const ReservationsGuide = () => {
	const theme = useAppSelector((state: RootState) => state.theme.current);

	return (
		<Accordion
			title=" 예매 안내"
			className="rounded shadow-inner mb-4"
		>
			<div>
				<ul className="text-xs md:text-sm space-y-1.5">
					<li className="flex items-center gap-2">
						<div className={clsx(
							"w-1.5 h-1.5 rounded-full flex-shrink-0",
							theme === "normal" ? "bg-black/60" : "bg-white/60"
						)}></div>
						<span>예매 승인 완료 후에 티켓이 발급됩니다.</span>
					</li>
					<li className="flex items-center gap-2">
						<div className={clsx(
							"w-1.5 h-1.5 rounded-full flex-shrink-0",
							theme === "normal" ? "bg-black/60" : "bg-white/60"
						)}></div>
						<span>예매 취소는 <b>예매 대기</b> 상태일 때만 가능합니다.</span>
					</li>
					<li className="flex items-center gap-2">
						<div className={clsx(
							"w-1.5 h-1.5 rounded-full flex-shrink-0",
							theme === "normal" ? "bg-black/60" : "bg-white/60"
						)}></div>
						<span>티켓 취소는 <b>티켓 관리 탭</b>을 이용해 주세요.</span>
					</li>
					<li className="flex items-center gap-2">
						<div className={clsx(
							"w-1.5 h-1.5 rounded-full flex-shrink-0",
							theme === "normal" ? "bg-black/60" : "bg-white/60"
						)}></div>
						<span>사용자 예매 대기 중 공연이 매진될 수 있습니다. 입금 전 꼭 공연 상태를 확인해주세요.</span>
					</li>
				</ul>
			</div>
		</Accordion>
	);
};

export default ReservationsGuide;
