'use client'

import React, { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import { Theme } from '@/types/ui/theme';
import Input from '@/components/base/Input';
import Button from '@/components/base/Button';
import { RefundAccount } from '@/types/model/refundAccount';
import useToast from '@/hooks/useToast';

export interface RefundAccountModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (accountInfo: { bankName: string; accountNumber: string; accountHolder: string; id?: string }) => void;
	existingAccounts?: RefundAccount[];
	isSubmitting?: boolean;
	theme: Theme;
}

export const RefundAccountModal = ({ 
	isOpen, 
	onClose, 
	onSubmit, 
	existingAccounts = [],
	isSubmitting = false,
	theme 
}: RefundAccountModalProps) => {
	const [selectedAccountId, setSelectedAccountId] = useState<string>('');
	const [bankName, setBankName] = useState('');
	const [accountNumber, setAccountNumber] = useState('');
	const [accountHolder, setAccountHolder] = useState('');
	const [isNewAccount, setIsNewAccount] = useState(false);
	const { showToast } = useToast();

	// 기존 계좌가 있으면 첫 번째 계좌를 기본 선택
	useEffect(() => {
		if (existingAccounts.length > 0 && !selectedAccountId) {
			setSelectedAccountId(existingAccounts[0].id);
			setIsNewAccount(false);
		} else if (existingAccounts.length === 0) {
			setIsNewAccount(true);
		}
	}, [existingAccounts, selectedAccountId]);

	const handleNewAccountToggle = () => {
		setIsNewAccount(!isNewAccount);

		if (!isNewAccount) {
			// 새 계좌 입력 모드로 전환 시 기존 값 초기화
			setSelectedAccountId('');
			setBankName('');
			setAccountNumber('');
			setAccountHolder('');
		} else {
			// 기존 계좌 선택 모드로 전환 시 첫 번째 계좌 선택
			if (existingAccounts.length > 0) {
				setSelectedAccountId(existingAccounts[0].id);
			}
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		if (isNewAccount) {
			// 새 계좌 정보 유효성 검사
			if (!bankName.trim()) {
				showToast({ message: '은행명을 입력해주세요.', iconType: 'error' });
				return;
			}
			if (!accountNumber.trim()) {
				showToast({ message: '계좌번호를 입력해주세요.', iconType: 'error' });
				return;
			}
			if (!accountHolder.trim()) {
				showToast({ message: '예금주를 입력해주세요.', iconType: 'error' });
				return;
			}
			
			// 유효성 검사 통과 시 제출
			onSubmit({ bankName: bankName.trim(), accountNumber: accountNumber.trim(), accountHolder: accountHolder.trim() });
		} else {
			// 기존 계좌 선택 유효성 검사
			if (!selectedAccountId) {
				showToast({ message: '계좌를 선택해주세요.', iconType: 'error' });
				return;
			}
			
			// 유효성 검사 통과 시 제출
			const selectedAccount = existingAccounts.find(acc => acc.id === selectedAccountId);
			if (selectedAccount) {
				onSubmit({
					bankName: selectedAccount.bankName,
					accountNumber: selectedAccount.accountNumber,
					accountHolder: selectedAccount.accountHolder,
					id: selectedAccount.id
				});
			}
		}
	};

	// disabled 조건 제거 - 항상 활성화
	const isSubmitDisabled = () => {
		return isSubmitting;
	};

	const handleClose = () => {
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose}>
			<div className="max-w-md mx-auto">
				<div className="mb-6">
					<h2 className="text-xl font-semibold mb-2">환불계좌 정보</h2>
					<p className="text-sm opacity-70">양도받은 티켓 취소 시 환불받을 계좌 정보를 입력해주세요.</p>
				</div>

				{/* 계좌 입력 방식 선택 */}
				{existingAccounts.length > 0 && (
					<div className="mb-6">
						<div className="flex space-x-2 mb-4">
							<button
								type="button"
								onClick={() => setIsNewAccount(false)}
								className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
									!isNewAccount
										? theme === 'normal' 
											? 'bg-green-100 text-green-700 border border-green-200' 
											: 'bg-green-600 text-white border border-green-500'
										: theme === 'normal'
											? 'bg-gray-100 text-gray-600 border border-gray-200'
											: 'bg-gray-700 text-gray-300 border border-gray-600'
								}`}
							>
								기존 계좌 선택
							</button>
							<button
								type="button"
								onClick={() => setIsNewAccount(true)}
								className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
									isNewAccount
										? theme === 'normal' 
											? 'bg-green-100 text-green-700 border border-green-200' 
											: 'bg-green-600 text-white border border-green-500'
										: theme === 'normal'
											? 'bg-gray-100 text-gray-600 border border-gray-200'
											: 'bg-gray-700 text-gray-300 border border-gray-600'
								}`}
							>
								새 계좌 입력
							</button>
						</div>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-3">
					{isNewAccount ? (
						// 새 계좌 입력
						<div className="space-y-3">
							<div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
								<div className="flex items-center space-x-2 mb-3">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<span className="text-sm font-medium text-gray-700">새 계좌 입력</span>
								</div>
								<div className="space-y-3">
									<div>
										<label className="block text-sm font-medium mb-2 text-gray-700">은행명</label>
										<Input
											value={bankName}
											onChange={(e) => setBankName(e.target.value)}
											placeholder="예: 신한은행, KB국민은행"
											theme={theme}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-2 text-gray-700">계좌번호</label>
										<Input
											value={accountNumber}
											onChange={(e) => setAccountNumber(e.target.value)}
											placeholder="예: 110-123456789"
											theme={theme}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-2 text-gray-700">예금주</label>
										<Input
											value={accountHolder}
											onChange={(e) => setAccountHolder(e.target.value)}
											placeholder="예: 홍길동"
											theme={theme}
										/>
									</div>
								</div>
							</div>
						</div>
					) : (
						// 기존 계좌 선택
						<div className="space-y-3">
							{existingAccounts.map((account) => (
								<div
									key={account.id}
									onClick={() => setSelectedAccountId(account.id)}
									className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
										selectedAccountId === account.id
											? theme === 'normal'
												? 'border-green-500 bg-green-50'
												: 'border-green-400 bg-green-900/20'
											: theme === 'normal'
												? 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
												: 'border-gray-600 bg-gray-800 hover:border-gray-500 hover:bg-gray-700'
									}`}
								>
									<div className="flex items-center justify-between">
										<div className="flex-1">
											<div className="font-medium text-sm mb-1">
												{account.bankName} {account.accountNumber}
											</div>
											<div className="text-xs opacity-70">
												{account.accountHolder}
											</div>
										</div>
										<div className={`w-4 h-4 rounded-full border-2 ${
											selectedAccountId === account.id
												? theme === 'normal'
													? 'border-green-500 bg-green-500'
													: 'border-green-400 bg-green-400'
												: theme === 'normal'
													? 'border-gray-300'
													: 'border-gray-500'
										}`}>
											{selectedAccountId === account.id && (
												<div className="w-2 h-2 bg-white rounded-full m-0.5" />
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					<div className="flex space-x-3 pt-4">
						<Button
              theme={theme === 'normal' ? 'dark' : theme}
							type="button"
							onClick={handleClose}
              padding="py-1"
							className="flex-1 font-semibold"
						>
							취소
						</Button>
						<Button
							theme={theme === 'normal' ? 'dark' : theme}
							type="submit"
							disabled={isSubmitDisabled()}
              padding="py-1"
							className="flex-1 font-semibold"
						>
							{isSubmitting ? '처리 중...' : '확인'}
						</Button>
					</div>
				</form>
			</div>
		</Modal>
	);
};

export default RefundAccountModal;
