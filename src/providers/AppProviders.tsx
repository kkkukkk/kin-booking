'use client';

import React, { useEffect, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store, persistor } from "@/redux/store";
import QueryProvider from "./QueryProvider";
import { PersistGate } from "redux-persist/integration/react";
import SpinnerOverlay from "@/components/spinner/SpinnerOverlay";

const AppProviders = ({ children }: { children: React.ReactNode }) => {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true); // 클라이언트에서만 true
	}, []);

	return (
		<ReduxProvider store={store}>
			{isClient && persistor ? (
				<PersistGate loading={<SpinnerOverlay />} persistor={persistor}>
					<QueryProvider>{children}</QueryProvider>
				</PersistGate>
			) : (
				<QueryProvider>{children}</QueryProvider>
			)}
		</ReduxProvider>
	);
};

export default AppProviders;