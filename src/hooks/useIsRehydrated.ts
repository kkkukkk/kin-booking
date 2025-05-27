import { persistor } from '@/redux/store';
import { useState, useEffect } from 'react';

const useRehydrated = () => {
	const [rehydrated, setRehydrated] = useState(false);

	useEffect(() => {
		if (persistor) {
			const unsubscribe = persistor.subscribe(() => {
				const bootstrapped = persistor?.getState().bootstrapped;
				if (bootstrapped) {
					setRehydrated(true);
					unsubscribe();
				}
			});

			// 초기 상태가 이미 부트스트랩 완료면 바로 처리
			if (persistor?.getState().bootstrapped) {
				setRehydrated(true);
				unsubscribe();
			}

			return unsubscribe;
		} else {
			setRehydrated(true);
		}
	}, []);

	return rehydrated;
};

export default useRehydrated;