import Button from "@/components/base/Button";

interface MarketingProps {
	onClose?: () => void;
	onConfirm?: () => void;
}

const Marketing = ({ onClose, onConfirm }: MarketingProps) => {
	return (
		<section>
			<h2 className="text-lg md:text-2xl font-bold mb-4">[공연 관련 소식 수신 동의 (선택)]</h2>

			<article className="mb-4">
				<h3 className="font-semibold text-base md:text-lg">1. 수신 동의</h3>
				<p className="text-sm md:text-base">공연 정보를 이메일 및 SMS로 수신하는 것에 동의합니다.</p>
			</article>

			<article className="mb-4">
				<h3 className="font-semibold text-base md:text-lg">2. 안내 사항</h3>
				<p className="text-sm md:text-base">수신 동의는 언제든지 철회할 수 있으며(마이페이지), 수신 거부 시 별도의 절차에 따라 진행할 수 있습니다.</p>
			</article>

			<article>
				<h3 className="font-semibold text-base md:text-lg">3. 정보 제공 안내</h3>
				<p className="text-sm md:text-base">공연 정보 수신에 동의한 경우, 새로운 공연 소식 등을 회원이 제공한 연락처로 전달해 드릴 수 있습니다.</p>
			</article>

			{onClose && onConfirm && (
				<div className="flex items-center justify-center mt-6 gap-2">
					<Button
						width={"w-1/2"}
						padding={"p-1"}
						className={"text-sm md:text-lg font-semibold"}
						onClick={onClose}
					>취소</Button>
					<Button
						width={"w-1/2"}
						padding={"p-1"}
						className={"text-sm md:text-lg font-semibold"}
						onClick={onConfirm}
						theme={"dark"}
						reverse
					>동의</Button>
				</div>
			)}
		</section>
	)
}

export default Marketing;