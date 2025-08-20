import Button from "@/components/base/Button";

interface PersonalInfoProps {
	onClose?: () => void;
	onConfirm?: () => void;
}

const PersonalInfo = ({ onClose, onConfirm }: PersonalInfoProps) => {
	return (
		<section>
			<h2 className="text-lg md:text-2xl font-bold mb-4">[개인정보 수집 및 이용 동의 안내]</h2>

			<article className="mb-4">
				<h3 className="font-semibold text-base md:text-lg">1. 수집하는 개인정보 항목</h3>
				<p className="text-sm md:text-base">이름, 이메일, 비밀번호, 전화번호, 계좌 정보(환불 시 사용)</p>
			</article>

			<article className="mb-4">
				<h3 className="font-semibold text-base md:text-lg">2. 개인정보 수집 및 이용 목적</h3>
				<p className="text-sm md:text-base">회원관리, 예매 확인 및 공연 이용, 고객 상담</p>
			</article>

			<article className="mb-4">
				<h3 className="font-semibold text-base md:text-lg">3. 개인정보 보유 및 이용 기간</h3>
				<p className="text-sm md:text-base">회원 탈퇴 시까지 보유하며, 관련 법령에 따라 일정 기간 보관 후 파기</p>
			</article>

			<article className="mb-4">
				<h3 className="font-semibold text-base md:text-lg">4. 동의 거부 권리 및 불이익</h3>
				<p className="text-sm md:text-base">동의를 거부할 권리가 있으나, 필수 항목 미동의 시 회원가입 및 예매가 불가능합니다.</p>
			</article>

			<article>
				<h3 className="font-semibold text-base md:text-lg">5. 민감 정보 관리</h3>
				<p className="text-sm md:text-base">비밀번호는 보안을 위해 암호화되어 저장되며, 이를 복호화하거나 제공하지 않습니다.</p>
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

export default PersonalInfo;