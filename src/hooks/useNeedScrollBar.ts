import { useEffect, useState, RefObject } from 'react';

const useNeedScrollBar = (ref: RefObject<HTMLElement | null>, ready = true) => {
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

		const resizeObserver = new ResizeObserver(update);
		resizeObserver.observe(el);

		const mutationObserver = new MutationObserver(update);
		mutationObserver.observe(el, {
			childList: true,
			subtree: true,
			characterData: true,
		});

		return () => {
			resizeObserver.disconnect();
			mutationObserver.disconnect();
		};
	}, [ref, ready]);

	return needScrollBar;
};

export default useNeedScrollBar;