'use client';

import { PaymentAccount } from '@/types/model/paymentAccount';
import { Theme } from '@/types/ui/theme';
import Modal from '@/components/Modal';
import Button from '@/components/base/Button';
import Input from '@/components/base/Input';
import Textarea from '@/components/base/Textarea';
import CheckBoxWithLabel from '@/components/base/CheckBoxWithLabel';

interface PaymentAccountFormData {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    description: string;
    isActive: boolean;
    sortOrder: number;
}

interface PaymentAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PaymentAccountFormData) => void;
    formData: PaymentAccountFormData;
    setFormData: (data: PaymentAccountFormData) => void;
    theme: Theme;
    isEdit?: boolean;
}

const PaymentAccountModal = ({
    isOpen,
    onClose,
    onSubmit,
    formData,
    setFormData,
    theme,
    isEdit = false,
}: PaymentAccountModalProps) => {
    const handleSubmit = () => {
        onSubmit(formData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="space-y-4 min-w-[300px] md:min-w-md">
                <h2 className="text-xl font-bold mb-4">
                    {isEdit ? '계좌 수정' : '새 계좌 추가'}
                </h2>
                <div>
                    <label className="block text-sm font-medium mb-1">은행명 *</label>
                    <Input
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        placeholder="은행명을 입력하세요"
                        theme={theme}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">계좌번호 *</label>
                    <Input
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        placeholder="계좌번호를 입력하세요"
                        theme={theme}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">예금주 *</label>
                    <Input
                        value={formData.accountHolder}
                        onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                        placeholder="예금주명을 입력하세요"
                        theme={theme}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">설명</label>
                    <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="계좌에 대한 설명을 입력하세요"
                        rows={3}
                        theme={theme}
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">정렬순서</label>
                    <Input
                        type="number"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                        className="w-24"
                        theme={theme}
                    />
                </div>
                <div className="flex items-center">
                    <CheckBoxWithLabel
                        checked={formData.isActive}
                        onChange={(checked) => setFormData({ ...formData, isActive: checked })}
                        label="사용"
                    />
                </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
                <Button
                    onClick={onClose}
                    theme={theme === 'normal' ? 'dark' : theme}
                    reverse={theme === 'normal'}
                    padding="px-2 py-1"
                    fontSize="text-sm"
                    className="font-semibold"
                >
                    취소
                </Button>
                <Button
                    onClick={handleSubmit}
                    theme={theme === 'normal' ? 'dark' : theme}
                    reverse={theme === 'normal'}
                    padding="px-2 py-1"
                    fontSize="text-sm"
                    className="font-semibold"
                >
                    {isEdit ? '수정' : '생성'}
                </Button>
            </div>
        </Modal>
    );
};

export default PaymentAccountModal;
