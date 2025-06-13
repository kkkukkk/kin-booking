"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import SpinnerOverlay from "@/components/spinner/SpinnerOverlay";

interface SpinnerContextType {
	showSpinner: () => void;
	hideSpinner: () => void;
}

const SpinnerContext = createContext<SpinnerContextType | undefined>(undefined);

export const SpinnerProvider = ({ children }: { children: ReactNode }) => {
	const [visible, setVisible] = useState(false);

	const showSpinner = () => setVisible(true);
	const hideSpinner = () => setVisible(false);

	return (
		<SpinnerContext.Provider value={{ showSpinner, hideSpinner }}>
			{children}
			{visible && <SpinnerOverlay />}
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