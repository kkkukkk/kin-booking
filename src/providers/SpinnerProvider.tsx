"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import SpinnerOverlay from "@/components/spinner/SpinnerOverlay";

interface SpinnerContextType {
	showSpinner: (withBackgroundImage?: boolean) => void;
	hideSpinner: () => void;
}

const SpinnerContext = createContext<SpinnerContextType | undefined>(undefined);

export const SpinnerProvider = ({ children }: { children: ReactNode }) => {
	const [visible, setVisible] = useState(false);
	const [withBackgroundImage, setWithBackgroundImage] = useState(false);

	const showSpinner = (withBgImage?: boolean) => {
		setWithBackgroundImage(withBgImage ?? false);
		setVisible(true);
	};

	const hideSpinner = () => {
		setVisible(false);
		setWithBackgroundImage(false);
	};

	return (
		<SpinnerContext.Provider value={{ showSpinner, hideSpinner }}>
			{children}
			{visible && <SpinnerOverlay withBackgroundImage={withBackgroundImage} />}
		</SpinnerContext.Provider>
	);
};

export const useSpinner = () => {
	const context = useContext(SpinnerContext);
	if (!context) {
		throw new Error("useSpinner must be used within a SpinnerProvider");
	}
	return context;
};