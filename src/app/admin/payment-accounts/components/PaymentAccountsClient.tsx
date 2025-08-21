'use client';

import { useState } from 'react';
import { useAllPaymentAccounts, useCreatePaymentAccount, useUpdatePaymentAccount, useDeletePaymentAccount } from '@/hooks/api/usePaymentAccounts';
import { PaymentAccount } from '@/types/model/paymentAccount';
import { CreatePaymentAccountDto, UpdatePaymentAccountDto } from '@/types/dto/paymentAccount';
import useToast from '@/hooks/useToast';
import { useAlert } from '@/providers/AlertProvider';
import { useSpinner } from '@/hooks/useSpinner';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import Spinner from '@/components/spinner/Spinner';

import DataTable from '@/components/base/DataTable';
import PaymentAccountModal from './PaymentAccountModal';

interface PaymentAccountFormData {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
}

const PaymentAccountsClient = () => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const { showToast } = useToast();
  const { showAlert } = useAlert();
  const { showSpinner, hideSpinner } = useSpinner();
  
  // 정렬 상태
  const [sortConfig, setSortConfig] = useState<{
    field: string;
    direction: 'asc' | 'desc';
  }>({
    field: 'sortOrder',
    direction: 'asc'
  });
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<PaymentAccount | null>(null);
  const [formData, setFormData] = useState<PaymentAccountFormData>({
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    description: '',
    isActive: true,
    sortOrder: 0,
  });

  const { data: accounts = [], isLoading, refetch } = useAllPaymentAccounts();
  const createMutation = useCreatePaymentAccount();
  const updateMutation = useUpdatePaymentAccount();
  const deleteMutation = useDeletePaymentAccount();

  // 정렬된 계좌 목록
  const sortedAccounts = [...accounts].sort((a, b) => {
    const aValue = a[sortConfig.field as keyof PaymentAccount];
    const bValue = b[sortConfig.field as keyof PaymentAccount];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      return sortConfig.direction === 'asc' ? (aValue === bValue ? 0 : aValue ? -1 : 1) : (aValue === bValue ? 0 : aValue ? 1 : -1);
    }
    
    return 0;
  });

  // 정렬 변경 핸들러
  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setSortConfig({ field, direction });
  };

  // 모바일 카드 섹션 렌더 함수
  const mobileCardSections = (account: PaymentAccount) => ({
    firstRow: (
      <>
        <div className="w-full flex justify-between items-center">
          <div className="font-semibold text-sm truncate">
            {account.bankName}
          </div>
                  <div className="text-xs font-medium">
          {account.isActive ? '활성' : '비활성'}
        </div>
        </div>
      </>
    ),
    secondRow: (
      <>
        <div className="w-full flex flex-col gap-1 text-sm">
          <div className="flex justify-between">
            <span>계좌번호</span>
            <span className="font-mono">{account.accountNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>예금주</span>
            <span>{account.accountHolder}</span>
          </div>
        </div>
      </>
    ),
    actionButton: (
      <div className="flex gap-2">
        <Button
          onClick={() => handleEdit(account)}
          className="text-sm font-semibold"
          theme={theme === 'normal' ? 'dark' : theme}
          reverse={theme === 'normal'}
          padding="px-2 py-1"
          fontSize="text-xs"
        >
          수정
        </Button>
        <Button
          onClick={() => handleDelete(account)}
          className="text-sm text-red-500 hover:text-red-600 font-semibold"
          theme={theme === 'normal' ? 'dark' : theme}
          reverse={theme === 'normal'}
          padding="px-2 py-1"
          fontSize="text-xs"
        >
          삭제
        </Button>
      </div>
    ),
  });

  const handleCreate = () => {
    setFormData({
      bankName: '',
      accountNumber: '',
      accountHolder: '',
      description: '',
      isActive: true,
      sortOrder: accounts.length,
    });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (account: PaymentAccount) => {
    setEditingAccount(account);
    setFormData({
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      accountHolder: account.accountHolder,
      description: account.description || '',
      isActive: account.isActive,
      sortOrder: account.sortOrder,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (account: PaymentAccount) => {
    const confirmed = await showAlert({
      type: 'confirm',
      title: '계좌 삭제',
      message: `"${account.bankName} - ${account.accountHolder}" 계좌를 삭제하시겠습니까?`,
    });

    if (confirmed) {
      showSpinner();
      try {
        await deleteMutation.mutateAsync(account.id);
        showToast({ message: '계좌가 삭제되었습니다.', iconType: 'success', autoCloseTime: 3000 });
        refetch();
      } catch (error) {
        showToast({ message: `삭제 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`, iconType: 'error' });
      } finally {
        hideSpinner();
      }
    }
  };

  const handleModalSubmit = async (data: PaymentAccountFormData) => {
    if (!data.bankName || !data.accountNumber || !data.accountHolder) {
      showToast({ message: '필수 항목을 모두 입력해주세요.', iconType: 'warning', autoCloseTime: 3000 });
      return;
    }

    const isEdit = !!editingAccount;
    showSpinner();
    try {
      if (isEdit && editingAccount) {
        const updateData: UpdatePaymentAccountDto = {
          bankName: data.bankName,
          accountNumber: data.accountNumber,
          accountHolder: data.accountHolder,
          description: data.description || undefined,
          isActive: data.isActive,
          sortOrder: data.sortOrder,
        };
        await updateMutation.mutateAsync({ id: editingAccount.id, data: updateData });
        showToast({ message: '계좌가 수정되었습니다.', iconType: 'success', autoCloseTime: 3000 });
        setIsEditModalOpen(false);
        setEditingAccount(null);
      } else {
        const createData: CreatePaymentAccountDto = {
          bankName: data.bankName,
          accountNumber: data.accountNumber,
          accountHolder: data.accountHolder,
          description: data.description || undefined,
          isActive: data.isActive,
          sortOrder: data.sortOrder,
        };
        await createMutation.mutateAsync(createData);
        showToast({ message: '계좌가 생성되었습니다.', iconType: 'success', autoCloseTime: 3000 });
        setIsCreateModalOpen(false);
      }
      refetch();
    } catch (error) {
      showToast({ message: `${isEdit ? '수정' : '생성'} 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`, iconType: 'error' });
    } finally {
      hideSpinner();
    }
  };

  const tableColumns = [
    { 
      key: 'bankName', 
      header: '은행명',
      render: (account: PaymentAccount) => (
        <div className="text-sm font-medium">{account.bankName}</div>
      ),
      sortable: true,
      width: '10%',
    },
    { 
      key: 'accountNumber', 
      header: '계좌번호',
      render: (account: PaymentAccount) => (
        <div className="text-sm font-mono">{account.accountNumber}</div>
      ),
      sortable: true,
      width: '20%',
    },
    { 
      key: 'accountHolder', 
      header: '예금주',
      render: (account: PaymentAccount) => (
        <div className="text-sm">{account.accountHolder}</div>
      ),
      sortable: true,
      width: '10%',
    },
    { 
      key: 'description', 
      header: '설명',
      render: (account: PaymentAccount) => (
        <div className={`text-sm ${
          theme === 'normal' ? 'text-gray-600' : 'text-gray-300'
        }`}>
          {account.description || '-'}
        </div>
      ),
      width: '25%',
    },
    { 
      key: 'isActive', 
      header: '상태',
      render: (account: PaymentAccount) => (
        <div className="text-sm">
          <div className="font-medium">
            {account.isActive ? '활성' : '비활성'}
          </div>
        </div>
      ),
      sortable: true,
      width: '8%',
    },
    { 
      key: 'sortOrder', 
      header: '순서',
      render: (account: PaymentAccount) => (
        <div className="text-sm text-center">{account.sortOrder}</div>
      ),
      sortable: true,
      width: '8%',
    },
    { 
      key: 'actions', 
      header: '관리',
      render: (account: PaymentAccount) => (
        <div className="flex gap-2">
          <Button
            onClick={() => handleEdit(account)}
            className="px-2 py-1 text-sm font-semibold"
            theme={theme === 'normal' ? 'dark' : theme}
            reverse={theme === 'normal'}
            padding="px-2 py-1"
            fontSize="text-xs"
          >
            수정
          </Button>
          <Button
            onClick={() => handleDelete(account)}
            className="px-2 py-1 text-sm text-red-500 hover:text-red-600 font-semibold"
            theme={theme === 'normal' ? 'dark' : theme}
            reverse={theme === 'normal'}
            padding="px-2 py-1"
            fontSize="text-xs"
          >
            삭제
          </Button>
        </div>
      ),
      width: '20%',
    },
  ];

  

  if (isLoading) {
    return (
      <ThemeDiv className="flex flex-col min-h-full">
        <div className="px-6 py-4 space-y-4 md:py-6 md:space-y-6 flex-shrink-0">
          <div className={`${theme === 'neon' ? 'text-green-400' : ''}`}>
            <h1 className="text-lg md:text-xl font-bold">계좌 관리</h1>
          </div>
        </div>
        <div className="px-6 pb-6 flex-1 flex flex-col min-h-fit md:min-h-0">
          <div className="flex items-center justify-center h-64">
            <Spinner />
          </div>
        </div>
      </ThemeDiv>
    );
  }

  return (
    <ThemeDiv className="flex flex-col min-h-full">
      {/* 헤더 영역 */}
      <div className="px-6 py-4 space-y-4 md:py-6 md:space-y-6 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className={`${theme === 'neon' ? 'text-green-400' : ''}`}>
            <h1 className="text-lg md:text-xl font-bold">계좌 관리</h1>
          </div>
          <Button 
            onClick={handleCreate} 
            theme={theme}
            className="flex items-center gap-2"
          >
            새 계좌 추가
          </Button>
        </div>
      </div>

      {/* 테이블 상단 정보 영역 */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-2">
        <div className="flex-1 flex justify-start mb-2 sm:mb-0">
          <span className="text-sm text-gray-400">
            총 {sortedAccounts.length}건
          </span>
        </div>
      </div>

      {/* 테이블 영역 */}
      <div className="px-6 pb-6 flex-1 flex flex-col min-h-fit md:min-h-0">
        <div className="flex-1 min-h-fit md:min-h-0">
          <DataTable
            columns={tableColumns}
            data={sortedAccounts}
            theme={theme}
            className="h-full"
            sortConfig={sortConfig}
            onSortChange={handleSortChange}
            mobileCardSections={mobileCardSections}
          />
        </div>
      </div>

      {/* 생성 모달 */}
      <PaymentAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleModalSubmit}
        formData={formData}
        setFormData={setFormData}
        theme={theme}
        isEdit={false}
      />

      {/* 수정 모달 */}
      <PaymentAccountModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingAccount(null);
        }}
        onSubmit={handleModalSubmit}
        formData={formData}
        setFormData={setFormData}
        theme={theme}
        isEdit={true}
      />
    </ThemeDiv>
  );
};

export default PaymentAccountsClient;
