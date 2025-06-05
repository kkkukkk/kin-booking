'use client'

import useAlert from "@/hooks/useAlert";
import ThemeDiv from "@/components/base/ThemeDiv";
import Toast from "@/components/alert/Toast";
import React from "react";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import {useAppSelector} from "@/redux/hooks";

const Alert = () => {
	const theme = useAppSelector((state) => state.theme.current);

	const {
		isOpen,
		type,
		message,
		inputValue,
		setInputValue,
		hideAlert,
	} = useAlert();

	// toast는 별도 컴포넌트로 분기
	if (type === 'toast') {
		return <Toast />;
	}

	if (!isOpen) return null;

	return (
		<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-50">
			<ThemeDiv
				className="bg-white p-6 rounded-md shadow-lg min-w-[300px] max-w-[90%]"
			>
				<div
					className={
						"flex items-center cursor-pointer absolute top-4 right-4 font-bold"
					}
					onClick={hideAlert}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
					     className="bi bi-x-lg" viewBox="0 0 16 16">
						<path
							d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
					</svg>
				</div>
				<p className="mb-4">{message}</p>

				{type === 'prompt' && (
					<Input
						type="text"
						value={inputValue}
						variant={'underline'}
						theme={theme}
						onChange={(e) => setInputValue(e.target.value)}
						className="border border-gray-300 rounded px-2 py-1 w-full mb-4"
					/>
				)}

				<div className="flex justify-center gap-2">
					<Button
						onClick={hideAlert}
						theme={"dark"}
						widthPx={"42px"}
						heightPx={"30px"}
					>확인</Button>
					<Button
						onClick={hideAlert}
						theme={"dark"}
						widthPx={"42px"}
						heightPx={"30px"}
					>취소</Button>
				</div>
			</ThemeDiv>
		</div>
	);
};

export default Alert;