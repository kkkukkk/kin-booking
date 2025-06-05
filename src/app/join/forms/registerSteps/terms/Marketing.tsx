import Button from "@/components/base/Button";

interface MarketingProps {
	onClose: () => void;
	onConfirm: () => void;
}

const Marketing = ({onClose, onConfirm}: MarketingProps) => {
	return (
		<section>
			<h2 className="text-lg md:text-2xl font-bold mb-4">[공연 관련 소식 수신 동의 (선택)]</h2>

			<article className="mb-4">
				<h3 className="font-semibold text-base md:text-xl">1. 수신 동의</h3>
				<p className="text-sm md:text-lg">공연 정보를 이메일 및 SMS로 수신하는 것에 동의합니다.</p>
			</article>

			<article className="mb-4">
				<h3 className="font-semibold text-base md:text-xl">2. 안내 사항</h3>
				<p className="text-sm md:text-lg">수신 동의는 언제든지 철회할 수 있으며, 수신 거부 시 별도의 절차에 따라 진행할 수 있습니다.</p>
			</article>

			<div className="flex items-center justify-center mt-4 gap-2">
				<Button
					widthPx={"50%"}
					padding={"p-1"}
					onClick={onClose}
				>취소</Button>
				<Button
					widthPx={"50%"}
					padding={"p-1"}
					onClick={onConfirm}
					theme={"dark"}
				>동의</Button>
			</div>
		</section>
	)
}

export default Marketing;