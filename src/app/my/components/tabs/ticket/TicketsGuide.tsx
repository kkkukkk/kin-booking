'use client'

import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import Accordion from '@/components/base/Accordion';
import clsx from 'clsx';

const TicketsGuide = () => {
	const theme = useAppSelector((state: RootState) => state.theme.current);

	return (
		<Accordion
			title=" 티켓 안내"
			className="rounded shadow-inner mb-4"
		>
			<div>
				<ul className="text-xs md:text-sm space-y-1.5">
					<li className="flex items-center gap-2">
						<div className={clsx(
							"w-1.5 h-1.5 rounded-full flex-shrink-0",
							theme === "normal" ? "bg-black/60" : "bg-white/60"
						)}></div>
						<span>티켓은 그룹 단위로 환불되며, 부분 환불은 불가능합니다.</span>
					</li>
					<li className="flex items-center gap-2">
						<div className={clsx(
							"w-1.5 h-1.5 rounded-full flex-shrink-0",
							theme === "normal" ? "bg-black/60" : "bg-white/60"
						)}></div>
						<span>양도받은 티켓은 같은 공연이라도 별도 그룹으로 관리됩니다.</span>
					</li>
					<li className="flex items-center gap-2">
						<div className={clsx(
							"w-1.5 h-1.5 rounded-full flex-shrink-0",
							theme === "normal" ? "bg-black/60" : "bg-white/60"
						)}></div>
						<span>취소 신청 후 관리자 확인을 거쳐 환불이 진행됩니다.</span>
					</li>
					<li className="flex items-center gap-2">
						<div className={clsx(
							"w-1.5 h-1.5 rounded-full flex-shrink-0",
							theme === "normal" ? "bg-black/60" : "bg-white/60"
						)}></div>
						<span>양도받은 티켓 취소 시 별도 환불계좌를 입력해야 합니다.</span>
					</li>
					<li className="flex items-center gap-2">
						<div className={clsx(
							"w-1.5 h-1.5 rounded-full flex-shrink-0",
							theme === "normal" ? "bg-black/60" : "bg-white/60"
						)}></div>
						<span>티켓 취소 신청 후에는 철회할 수 없습니다.</span>
					</li>
				</ul>
			</div>
		</Accordion>
	);
};

export default TicketsGuide;
