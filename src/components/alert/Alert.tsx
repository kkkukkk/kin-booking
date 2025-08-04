'use client'

import ThemeDiv from "@/components/base/ThemeDiv";
import React, {useEffect, useState} from "react";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import { useAppSelector } from "@/redux/hooks";
import { CloseIcon } from "@/components/icon/CloseIcon";
import { AlertProps } from "@/types/ui/alert";
import { createPortal } from "react-dom";
import clsx from "clsx";

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
		<div className={clsx(
			"fixed top-0 left-0 w-full h-full flex items-center justify-center z-10001",
			theme === "normal" && "bg-gradient-to-br from-black/50 via-black/40 to-black/50",
			theme === "dark" && "bg-gradient-to-br from-black/60 via-black/50 to-black/60",
			theme === "neon" && "bg-gradient-to-br from-black/70 via-purple-900/30 to-black/70"
		)}>
			<ThemeDiv
				className={"relative min-w-[320px] max-w-[480px] md:min-w-[400px] md:max-w-[520px] rounded shadow-2xl"}
				isChildren
			>
				{/* 메인 컨텐츠 */}
				<div className="p-4 md:p-6">
					{/* 헤더 영역 */}
					<div className="flex items-center justify-between pb-4 border-b border-gray-200/10">
						<div className={clsx(
							"text-lg w-full font-bold text-center md:text-xl relative",
							theme === "normal" && "text-blue-600",
							theme === "dark" && "text-gray-100",
							theme === "neon" && "text-cyan-400"
						)}>
							<span className="relative z-10">{title}</span>
						</div>
						<button
							className="absolute top-0 right-0 p-2 hover:bg-gray-100/20 dark:hover:bg-gray-800/20 rounded transition-colors"
							onClick={onCancel}
						>
							<CloseIcon />
						</button>
					</div>

					{/* 바디 영역 */}
					<div className="py-6">
						<div className="whitespace-pre-line text-sm md:text-base">
							{message}
						</div>

						{type === 'prompt' && (
							<Input
								type="text"
								value={inputValue}
								variant={'underline'}
								theme={theme}
								onChange={(e) => onChangeInput?.(e.target.value)}
								className={"rounded px-2 py-1 w-full"}
							/>
						)}
					</div>

					{/* 액션 영역 */}
					<div className="flex justify-center gap-3 pt-4 border-t border-gray-200/10">
						<Button 
							onClick={onConfirm} 
							theme={"dark"} 
							width={"w-1/3"} 
							padding={"px-3 py-1.5"}
							reverse={true}
							className={clsx(
								"transition-all duration-200",
								theme === "normal" && "hover:bg-blue-600 hover:border-blue-600",
								theme === "dark" && "hover:bg-gray-700 hover:border-gray-700",
								theme === "neon" && "hover:bg-cyan-600 hover:border-cyan-600"
							)}
						>
							확인
						</Button>
						{!noCancel && (
							<Button 
								onClick={onCancel} 
								theme={"normal"} 
								width={"w-1/3"} 
								padding={"px-3 py-1.5"}
								className={clsx(
									"transition-all duration-200",
									theme === "normal" && "hover:bg-gray-100 hover:border-gray-300",
									theme === "dark" && "hover:bg-gray-800 hover:border-gray-600",
									theme === "neon" && "hover:bg-purple-900/20 hover:border-purple-500"
								)}
						>
							취소
						</Button>
						)}
					</div>
				</div>
			</ThemeDiv>
		</div>,
		document.body
	);
};

export default Alert;