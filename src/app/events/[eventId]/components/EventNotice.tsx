'use client'

import { DEFAULT_REFUND_POLICY } from "@/types/refund";
import clsx from "clsx";

interface EventNoticeProps {
	theme: string;
}

const EventNotice = ({ theme }: EventNoticeProps) => {
	return (
		<div>
			<p className="text-sm opacity-70 my-3">예매 안내</p>
			<div className={clsx(
				"p-3 rounded-lg border text-xs space-y-1",
				theme === "normal" 
					? "bg-green-50 border-green-200 text-green-800" 
					: "bg-green-900/20 border-green-700 text-green-300"
			)}>
				<p>• 공연 시작 30분 전부터 입장 가능합니다.</p>
				<p>• 주차 공간이 협소하여 대중교통 이용 부탁드립니다.</p>
				<p>• 예매 후 취소는 공연 1일 전까지 가능합니다.</p>
				<div>
					<p>• 예매 취소 시 환불 비율:</p>
					<div className="ml-2 mt-1">
						<div className="text-xs border rounded overflow-hidden">
							<div className="flex border-b">
								<div className="flex-1 px-2 py-1 font-medium">취소일</div>
								<div className="flex-1 px-2 py-1 font-medium">환불</div>
							</div>
							{DEFAULT_REFUND_POLICY.refundRates
								.sort((a, b) => b.daysBefore - a.daysBefore)
								.map((rate, index) => (
									<div key={index} className="flex border-b last:border-b-0">
										<div className="flex-1 px-2 py-1">{rate.daysBefore}일 전</div>
										<div className="flex-1 px-2 py-1 font-medium">{rate.rate}%</div>
									</div>
								))
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventNotice; 