'use client';

import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/redux/store';
import QueryProvider from './QueryProvider';

const AppProviders = ({ children }: { children: React.ReactNode }) => {
	return (
		<ReduxProvider store={store}>
			<QueryProvider>
				{children}
			</QueryProvider>
		</ReduxProvider>
	);
};

export default AppProviders;