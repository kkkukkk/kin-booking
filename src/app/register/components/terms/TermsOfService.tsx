import Button from "@/components/base/Button";

interface TermsOfServiceProps {
	onClose: () => void;
	onConfirm: () => void;
}

const TermsOfService = ({ onClose, onConfirm }: TermsOfServiceProps) => {
	return (
		<section>
			<h2 className="text-lg md:text-2xl font-bold mb-4">[서비스 이용 약관]</h2>

			<article className="mb-4">
				<h3 className="font-semibold text-base md:text-xl">1. 서비스 이용 계약의 성립</h3>
				<p className="text-sm md:text-lg">회원은 본 약관에 동의함으로써 서비스 이용 계약이 성립됩니다.</p>
			</article>

			<article className="mb-4">
				<h3 className="font-semibold text-base md:text-xl">2. 회원의 의무</h3>
				<p className="text-sm md:text-lg">회원 정보는 정확하게 입력해야 하며, 비밀번호 관리에 책임을 집니다.</p>
			</article>

			<article className="mb-4">
				<h3 className="font-semibold text-base md:text-xl">3. 예매 및 취소 정책</h3>
				<p className="text-sm md:text-lg">공연 예매 후 취소는 공연 시작 24시간 전까지 가능하며, 그 이후에는 환불이 불가합니다.</p>
			</article>

			<article>
				<h3 className="font-semibold text-base md:text-xl">4. 서비스 이용 제한</h3>
				<p className="text-sm md:text-lg">부정 이용 시 서비스 이용이 제한될 수 있습니다.</p>
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
				>동의</Button>
			</div>
		</section>
	)
}

export default TermsOfService;