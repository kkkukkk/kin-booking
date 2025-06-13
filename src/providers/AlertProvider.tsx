import React, { createContext, useContext, useState, ReactNode } from 'react';
import Alert from '@/components/alert/Alert';
import type { AlertProps } from '@/types/ui/alert';

type AlertContextType = {
	showAlert: (props: Omit<AlertProps, 'onCancel' | 'onConfirm'>) => Promise<boolean>;
	hideAlert: () => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
	const [alertProps, setAlertProps] = useState<Omit<AlertProps, 'onCancel' | 'onConfirm'> | null>(null);
	const [promiseHandlers, setPromiseHandlers] = useState<{
		resolve: (value: boolean) => void;
	} | null>(null);

	const showAlert = (props: Omit<AlertProps, 'onConfirm' | 'onCancel'>): Promise<boolean> => {
		setAlertProps(props);
		return new Promise<boolean>((resolve) => {
			setPromiseHandlers({ resolve });
		});
	};

	const hideAlert = () => {
		setAlertProps(null);
		setPromiseHandlers(null);
	};

	const handleConfirm = () => {
		promiseHandlers?.resolve(true);
		hideAlert();
	};

	const handleCancel = () => {
		promiseHandlers?.resolve(false);
		hideAlert();
	};

	return (
		<AlertContext.Provider value={{ showAlert, hideAlert }}>
			{children}
			{alertProps && (
				<Alert
					{...alertProps}
					onConfirm={handleConfirm}
					onCancel={handleCancel}
				/>
			)}
		</AlertContext.Provider>
	);
};

export const useAlert = () => {
	const context = useContext(AlertContext);
	if (!context) throw new Error('useAlert must be used within AlertProvider');
	return context;
};