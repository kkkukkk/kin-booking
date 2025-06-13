'use client'

import ThemeDiv from "@/components/base/ThemeDiv";
import React, {useEffect, useState} from "react";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import { useAppSelector } from "@/redux/hooks";
import { CloseIcon } from "@/components/icon/CloseIcon";
import { AlertProps } from "@/types/ui/alert";
import { createPortal } from "react-dom";

const Alert = ({
	type = 'confirm',
	title,
	message,
	inputValue,
	noCancel = false,
	onChangeInput,
	onConfirm,
	onCancel,
}: AlertProps) => {
	const theme = useAppSelector((state) => state.theme.current);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	if (!mounted) return null;

	return createPortal(
		<div className={"fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-50"}>
			<ThemeDiv
				className={"bg-white p-6 rounded-md shadow-lg min-w-[300px] max-w-[90%] md:min-w-[500px]"}
			>
				<div
					className={"flex items-center cursor-pointer absolute top-4 right-4 font-bold"}
					onClick={onCancel}
				>
					<CloseIcon />
				</div>

				<div
					className={"text-lg w-full font-bold text-center md:text-xl"}
				>
					{title}
				</div>

				<div
					className={"mt-4 mb-6 whitespace-pre-line text-sm md:text-lg"}
				>{message}</div>

				{type === 'prompt' && (
					<Input
						type="text"
						value={inputValue}
						variant={'underline'}
						theme={theme}
						onChange={(e) => onChangeInput?.(e.target.value)}
						className={"rounded px-2 py-1 w-full mb-4"}
					/>
				)}

				<div className={"flex justify-center gap-2"}>
					<Button onClick={onConfirm} theme={"dark"} width={"30%"} padding={"px-2 py-1"}>
						확인
					</Button>
					{!noCancel && <Button onClick={onCancel} theme={"normal"} width={"30%"} padding={"px-2 py-1"}>
						취소
					</Button>}
				</div>
			</ThemeDiv>
		</div>,
		document.body
	);
};

export default Alert;