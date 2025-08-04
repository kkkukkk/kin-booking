"use client";

import {
	createContext,
	useState,
	ReactNode,
	useCallback,
	useRef,
} from "react";
import SpinnerOverlay from "@/components/spinner/SpinnerOverlay";

interface SpinnerContextType {
	showSpinner: (withBackgroundImage?: boolean) => void;
	hideSpinner: () => void;
	isVisible: boolean;
}

export const SpinnerContext = createContext<SpinnerContextType | undefined>(undefined);

export const SpinnerProvider = ({ children }: { children: ReactNode }) => {
	const [visible, setVisible] = useState(false);
	const [withBackgroundImage, setWithBackgroundImage] = useState(false);
	const spinnerCount = useRef(0);

	const showSpinner = useCallback((withBgImage?: boolean) => {
		spinnerCount.current += 1;
		setWithBackgroundImage(withBgImage ?? false);
		setVisible(true);
	}, []);

	const hideSpinner = useCallback(() => {
		spinnerCount.current = Math.max(0, spinnerCount.current - 1);
		if (spinnerCount.current === 0) {
			setVisible(false);
			setWithBackgroundImage(false);
		}
	}, []);

	return (
		<SpinnerContext.Provider value={{ showSpinner, hideSpinner, isVisible: visible }}>
			{children}
			{visible && <SpinnerOverlay withBackgroundImage={withBackgroundImage} />}
		</SpinnerContext.Provider>
	);
};