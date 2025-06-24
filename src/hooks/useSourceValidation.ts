'use client';

import { useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import useToast from '@/hooks/useToast';

const useSourceValidation = (expectedSource: string, redirectPath = '/login') => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { showToast } = useToast();

	const source = useMemo(() => searchParams.get('source'), [searchParams]);

	useEffect(() => {
		if (source !== expectedSource) {
			showToast({
				message: '비정상 접근이에요. 로그인 화면으로 이동합니다.',
				iconType: 'error',
				autoCloseTime: 3000,
			});
			router.replace(redirectPath);
		}
	}, [source, expectedSource, router, showToast, redirectPath]);
};

export default useSourceValidation;