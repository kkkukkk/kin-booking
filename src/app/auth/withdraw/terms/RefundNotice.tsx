import Button from "@/components/base/Button";

interface RefundNoticeProps {
  onConfirm?: () => void;
}

const RefundNotice = ({ onConfirm }: RefundNoticeProps) => (
  <section>
    <h2 className="text-lg md:text-2xl font-bold mb-4">[티켓 및 환불 관련 안내]</h2>

    <article className="mb-4">
      <h3 className="font-semibold text-base md:text-xl">1. 티켓 환불 후 탈퇴 권장</h3>
      <p className="text-sm md:text-lg">
        원활한 환불 절차를 위해, <strong>사용하지 않을</strong> 보유한 티켓은 <strong>취소 및 환불 완료</strong> 후 회원 탈퇴를 진행하시는 것을 권장합니다.
      </p>
    </article>

    <article className="mb-4">
      <h3 className="font-semibold text-base md:text-xl">2. 탈퇴 후 티켓 소유권 및 사용</h3>
      <p className="text-sm md:text-lg">
        탈퇴하더라도 기존 티켓에 대한 소유권은 상실되지 않으나, <strong>사용 또는 환불</strong>을 원하실 경우 반드시 관리자에게 문의해 주셔야 합니다.
      </p>
    </article>

    <article className="mb-4">
      <h3 className="font-semibold text-base md:text-xl">3. 티켓 환불 안내</h3>
      <p className="text-sm md:text-lg">
        티켓 환불 시, 서비스의 환불 정책에 명시된 비율(%)이 동일하게 적용되며, 환불 절차에 따라 처리가 지연될 수 있습니다.
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

export default RefundNotice; 