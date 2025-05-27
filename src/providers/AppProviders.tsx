'use client';

import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store, persistor } from "@/redux/store";
import QueryProvider from "./QueryProvider";
import { PersistGate } from "redux-persist/integration/react";
import SpinnerOverlay from "@/components/spinner/SpinnerOverlay";

const AppProviders = ({ children }: { children: React.ReactNode }) => {
	return (
		<ReduxProvider store={store}>
			<PersistGate
				loading={<SpinnerOverlay />}
				persistor={persistor}
			>
				<QueryProvider>{children}</QueryProvider>
			</PersistGate>
		</ReduxProvider>
	);
};

export default AppProviders;