'use client'

import React from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Button from "@/components/base/Button";
import ThemeDiv from "@/components/base/ThemeDiv";
import ThemeButtonSet from "@/components/panel/ThemeButtonSet";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type PanelContentProps = {
	isOpen: boolean;
	activeButtons:{ [key: string]: boolean };
	setActiveButtons: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
};

const PanelContent = ({ isOpen, activeButtons, setActiveButtons }: PanelContentProps) => {
	const router = useRouter();
	const currentTheme = useSelector((state: RootState) => state.theme.current);

	const toggleButton = (key: string) => {
		if (key === "Home") return;
		setActiveButtons((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	const panelButtons = [
		{
			key: 'Theme',
			onClick: () => console.log('Theme'),
			name: 'Theme',
		},
		{
			key: 'Home',
			onClick: () => router.push('/'),
			name:
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
				     className="bi bi-house-fill" viewBox="0 0 16 16">
					<path
						d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
					<path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"/>
				</svg>
		}
	]

	return (
		<ThemeDiv
			className={clsx(
				"absolute bottom-full mb-2 left-1/2 translate-x-[-50%]",
				"flex flex-col gap-2 p-2 rounded-full shadow-md",
				"transition-all duration-300 ease-out",
				isOpen
					? "opacity-100 scale-100 pointer-events-auto"
					: "opacity-0 scale-95 pointer-events-none"
			)}
			style={{
				width: "fit-content",
			}}
		>
			{panelButtons.map(({ key, onClick, name }) => (
				<Button
					key={key}
					theme={currentTheme !== "normal" ? currentTheme : "dark"} // normal 이면 적용 안 함
					onClick={() => {
						toggleButton(key);
						onClick();
					}}
					className="btn-base w-12 h-12 text-sm"
					round
					on={!!activeButtons[key]}
					reverse={!!activeButtons[key] && currentTheme === "normal"} // normal 일 때 on 이면 dark shadow
				>
					{name}
				</Button>
			))}
			<ThemeButtonSet isOpen={activeButtons["Theme"]} />
		</ThemeDiv>
	);
};

export default PanelContent;