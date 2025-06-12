import type { IconType } from "@/types/ui/alert"
import { showToast as showToastAction, hideToast as hideToastAction } from "@/redux/slices/toastSlice";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks"

export const useToastState = () => {
	return useAppSelector((state) => state.toast);
};

export const useToastActions = () => {
	const dispatch = useAppDispatch();

	const showToast  = useCallback(
		(payload: {
			message: string;
			autoCloseTime?: number;
			iconType?: IconType;
		}) => {
			dispatch(showToastAction(payload));
		},
		[dispatch]
	);

	const hideToast = useCallback(() => {
		dispatch(hideToastAction());
	}, [dispatch]);

	return { showToast, hideToast };
};

const useToast = () => {
	const state = useToastState();
	const actions = useToastActions();
	return { ...state, ...actions };
};

export default useToast;