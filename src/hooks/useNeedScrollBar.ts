import React, { useEffect, useState } from 'react';

const useNeedScrollBar = (ref: React.RefObject<HTMLElement>, ready = true) => {
	const [needScrollBar, setNeedScrollBar] = useState(false);

	useEffect(() => {
		if (!ready || !ref.current) return;

		const el = ref.current;

		const update = () => {
			if (!el) return;
			const need = el.scrollHeight > el.clientHeight;
			setNeedScrollBar(need);
		};
		update();

		const mutationObserver = new MutationObserver(() => {
			update();
		});
		mutationObserver.observe(el, {
			childList: true,
			subtree: true,
			characterData: true,
		});

		return () => {
			mutationObserver.disconnect();
		};
	}, [ref, ready]);

	return needScrollBar;
};

export default useNeedScrollBar;