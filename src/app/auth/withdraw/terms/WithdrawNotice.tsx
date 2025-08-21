import Button from "@/components/base/Button";

interface WithdrawNoticeProps {
  onConfirm?: () => void;
}

const WithdrawNotice = ({ onConfirm }: WithdrawNoticeProps) => (
  <section>
    <h2 className="text-lg md:text-2xl font-bold mb-4">[회원 탈퇴 안내]</h2>

    <article className="mb-4">
      <h3 className="font-semibold text-base md:text-xl">1. 계정 및 데이터 삭제</h3>
      <p className="text-sm md:text-lg">
        회원 탈퇴 시 계정은 복구가 불가능하며, 관련된 대부분의 데이터가 삭제 또는 비활성화됩니다.
      </p>
    </article>

    <article className="mb-4">
      <h3 className="font-semibold text-base md:text-xl">2. 개인정보 보관 및 삭제</h3>
      <p className="text-sm md:text-lg">
        사용자가 제공한 개인정보는 관련 법령에 따라 일정 기간 보관 후 안전하게 삭제됩니다.
      </p>
    </article>

    <article>
      <h3 className="font-semibold text-base md:text-xl">3. 기타 유의사항</h3>
      <p className="text-sm md:text-lg">
        탈퇴 후에는 동일한 이메일로 재가입이 제한될 수 있습니다.<br />
        관련된 문의사항은 관리자에게 연락해 주세요.
      </p>
    </article>

    {onConfirm && (
      <div className="flex items-center justify-center mt-6">
        <Button
          width="w-full"
          padding="p-2"
          className="text-sm md:text-lg font-semibold"
          onClick={onConfirm}
          theme="dark"
          reverse
        >
          동의합니다
        </Button>
      </div>
    )}
  </section>
);

export default WithdrawNotice; 