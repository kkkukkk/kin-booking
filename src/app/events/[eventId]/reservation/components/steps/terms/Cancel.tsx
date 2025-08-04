import { RefundPolicy } from "@/types/refund";
import Button from "@/components/base/Button";

interface CancellationPolicyProps {
	policy: RefundPolicy;
	onClose?: () => void;
	onConfirm?: () => void;
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
					<li>환불 요청 시 환불 계좌 정보를 요청 드리오니, 협조 부탁드립니다.</li>
				</ul>
			</article>

			<article>
				<h3 className="font-semibold text-base md:text-xl">3. 티켓 양도</h3>
				<ul className="text-sm md:text-lg list-disc pl-5">
					<li>본 공연은 티켓 양도가 가능합니다.</li>
					<li>티켓 양도는 마이 페이지 내 <strong>티켓 관리</strong> 메뉴에서 가능합니다.</li>
					<li>양도 받은 티켓의 소유권은 양도받은 분에게 있으며 동일한 권한으로 입장 및 취소/환불 할 수 있습니다.</li>
					<li>양도 완료 후에는 양도인의 취소 및 환불이 불가능하니, 신중히 결정해 주시기 바랍니다.</li>
				</ul>
			</article>

			{onClose && onConfirm && (
				<div className="flex items-center justify-center mt-6 gap-2">
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
			)}
		</section>
	);
};

export default CancellationPolicy;