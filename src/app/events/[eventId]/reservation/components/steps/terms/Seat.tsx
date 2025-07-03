import Button from "@/components/base/Button";

interface NoticeProps {
	onClose: () => void;
	onConfirm: () => void;
}

const ReservationNotice = ({ onClose, onConfirm }: NoticeProps) => {
	return (
		<section>
			<h2 className="text-lg md:text-2xl font-bold mb-4">[예매 전 주의사항]</h2>

			<article className="mb-4">
				<h3 className="font-semibold text-base md:text-xl">1. 잔여 좌석 변동</h3>
				<p className="text-sm md:text-lg">
					잔여 좌석 수는 실시간으로 변동되며, 예매 도중 매진될 수 있습니다.
				</p>
			</article>

			<article className="mb-4">
				<h3 className="font-semibold text-base md:text-xl">2. 예매 순서</h3>
				<p className="text-sm md:text-lg">
					예매 신청 후, 계좌 입금이 확인되면 관리자가 예매를 확정합니다. 입금 확인 후 티켓이 배정되며, 입금 지연 시 예매가 취소될 수 있습니다.
				</p>
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

export default ReservationNotice;