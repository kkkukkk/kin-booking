import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";  // store 설정에 따라 경로 조정
import { openAlert, closeAlert } from "@/redux/slices/alertSlice";
import type { AlertType } from "@/types/alert"
import { useCallback } from "react";

export const useAlertState = () => {
	return useSelector((state: RootState) => state.alert);
};

export const useAlertActions = () => {
	const dispatch = useDispatch<AppDispatch>();

	const showAlert = useCallback(
		(payload: { type: AlertType; message: string; inputValue?: string }) => {
			dispatch(openAlert(payload));
		},
		[dispatch]
	);

	const hideAlert = useCallback(() => {
		dispatch(closeAlert());
	}, [dispatch]);

	const setInputValue = useCallback(
		(value: string) => {
			dispatch(setInputValue(value));
		},
		[dispatch]
	);

	return { showAlert, hideAlert, setInputValue };
};

// 상태 + action
const useAlert = () => {
	const state = useAlertState();
	const actions = useAlertActions();
	return { ...state, ...actions };
};

export default useAlert;