import { openAlert, closeAlert, setInputValue } from "@/redux/slices/alertSlice";
import type { AlertType } from "@/types/ui/alert"
import { useCallback } from "react";
import {useAppDispatch, useAppSelector} from "@/redux/hooks"

export const useAlertState = () => {
	return useAppSelector((state) => state.alert);
};

export const useAlertActions = () => {
	const dispatch = useAppDispatch();

	const showAlert = useCallback(
		(payload: { type: AlertType; message: string; inputValue?: string, autoCloseTime?: number }) => {
			dispatch(openAlert(payload));
		},
		[dispatch]
	);

	const hideAlert = useCallback(() => {
		dispatch(closeAlert());
	}, [dispatch]);

	const setInputValueAction = useCallback(
		(value: string) => {
			dispatch(setInputValue(value));
		},
		[dispatch]
	);

	return { showAlert, hideAlert, setInputValue: setInputValueAction };
};

const useAlert = () => {
	const state = useAlertState();
	const actions = useAlertActions();
	return { ...state, ...actions };
};

export default useAlert;