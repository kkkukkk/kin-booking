import React from "react";
import { RefundPolicy } from "@/types/refund";
import Button from "@/components/base/Button";

interface CancellationPolicyProps {
	policy: RefundPolicy;
	onClose: () => void;
	onConfirm: () => void;
}

const CancellationPolicy = ({ policy, onClose, onConfirm }: CancellationPolicyProps) => {
	const sortedRates = [...policy.refundRates].sort((a, b) => b.daysBefore - a.daysBefore);

	return (
		<section>
			<h2 className="text-lg md:text-2xl font-bold mb-4">[예매 취소 / 환불 규정 안내]</h2>

			<article className="mb-4">
				<h3 className="font-semibold text-base md:text-xl">1. 환불 기준</h3>
				<ul className="text-sm md:text-lg list-disc pl-5">
					{sortedRates.map((rate, idx) => (
						<li key={idx}>
							공연 {rate.daysBefore}일 전까지 취소 시 {rate.rate}% 환불
						</li>
					))}
					<li>
						공연 <strong>당일</strong> 취소 시 환불이 불가능합니다.
					</li>
				</ul>
			</article>

			<article className="mb-4">
				<h3 className="font-semibold text-base md:text-xl">2. 유의 사항</h3>
				<ul className="text-sm md:text-lg list-disc pl-5">
					<li>공연일 기준 {policy.cancelableUntil}일 전까지 취소 가능합니다.</li>
					<li>공연 당일 및 이후에는 환불이 불가능합니다.</li>
					<li>환불 요청은 관리자 확인 후 순차적으로 처리됩니다.</li>
				</ul>
			</article>

			<div className="flex items-center justify-center mt-4 gap-2">
				<Button
					width={"w-1/2"}
					padding={"p-1"}
					className={"text-sm md:text-lg"}
					onClick={onClose}
				>취소</Button>
				<Button
					width={"w-1/2"}
					padding={"p-1"}
					className={"text-sm md:text-lg"}
					onClick={onConfirm}
					theme={"dark"}
					reverse
				>확인</Button>
			</div>
		</section>
	);
};

export default CancellationPolicy;