import { Dispatch, SetStateAction, useState } from 'react';
import ConsentItem from '@/components/consent/ConsentItem';
import WithdrawNotice from './terms/WithdrawNotice';
import RefundNotice from './terms/RefundNotice';
import Modal from '@/components/Modal';

const consentItems = [
  {
    key: 'withdraw',
    label: '회원 탈퇴 안내',
    detail: 'withdraw',
    required: true,
  },
  {
    key: 'refund',
    label: '티켓 및 환불 관련 안내',
    detail: 'refund',
    required: true,
  },
];

type DetailType = 'withdraw' | 'refund' | null;

interface WithdrawConsentProps {
  checked: { [key: string]: boolean };
  setChecked: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
}

const WithdrawConsent = ({ checked, setChecked }: WithdrawConsentProps) => {
  const [showDetail, setShowDetail] = useState<DetailType>(null);

  const handleDetailConfirm = (detail: DetailType) => {
    if (detail) setChecked(prev => ({ ...prev, [detail]: true }));
    setShowDetail(null);
  };

  const handleCancel = (detail: DetailType) => {
    if (detail) setChecked(prev => ({ ...prev, [detail]: false }));
    setShowDetail(null);
  };

  const getDetailComponent = (detail: DetailType) => {
    const props = {
      onClose: () => handleCancel(detail),
      onConfirm: () => handleDetailConfirm(detail),
    };
    if (detail === 'withdraw') return <WithdrawNotice {...props} />;
    if (detail === 'refund') return <RefundNotice {...props} />;
    return null;
  };

  return (
    <div className="flex flex-col gap-4 my-8 md:my-10">
      {consentItems.map(item => (
        <ConsentItem
          key={item.key}
          checked={!!checked[item.key]}
          label={item.label}
          onClickDetail={() => setShowDetail(item.detail as DetailType)}
          required={item.required}
        />
      ))}
      {showDetail && (
        <Modal onClose={() => setShowDetail(null)}>
          {getDetailComponent(showDetail)}
        </Modal>
      )}
    </div>
  );
};

export default WithdrawConsent; 