'use client';

import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import { AlertProvider } from "@/providers/AlertProvider";
import { SpinnerProvider } from "@/providers/SpinnerProvider";
import { SessionProvider } from "@/providers/SessionProvider";
import QueryProvider from "./QueryProvider";

const AppProviders = ({ children }: { children: React.ReactNode }) => {
	return (
		<ReduxProvider store={store}>
			<PersistGate
				loading={null}
				persistor={persistor}
			>
				<SessionProvider>
					<AlertProvider>
						<SpinnerProvider>
							<QueryProvider>{children}</QueryProvider>
						</SpinnerProvider>
					</AlertProvider>
				</SessionProvider>
			</PersistGate>
		</ReduxProvider>
	);
};

export default AppProviders;