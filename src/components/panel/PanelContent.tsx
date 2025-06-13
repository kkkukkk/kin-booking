'use client'

import React from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Button from "@/components/base/Button";
import ThemeDiv from "@/components/base/ThemeDiv";
import ThemeButtonSet from "@/components/panel/ThemeButtonSet";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { HomeIcon } from "@/components/icon/HomeIcon";
import { useLogout } from "@/hooks/api/useAuth";
import { useSession } from "@/hooks/useSession";

type PanelContentProps = {
	isOpen: boolean;
	activeButtons:{ [key: string]: boolean };
	setActiveButtons: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
};

const PanelContent = ({ isOpen, activeButtons, setActiveButtons }: PanelContentProps) => {
	const router = useRouter();
	const currentTheme = useAppSelector((state: RootState) => state.theme.current);
	const { mutate: logout } = useLogout();
	const { session } = useSession();

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
		...(session
			? [
				{
					key: 'Logout',
					onClick: () => logout(),
					name: 'Logout',
				},
			]
			: [
				{
					key: 'Login',
					onClick: () => router.push('/join'),
					name: 'Login',
				},
			]),
		{
			key: 'Home',
			onClick: () => router.push('/'),
			name:
				<HomeIcon />
		},
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
					on={!!activeButtons[key]}
					reverse={!!activeButtons[key] && currentTheme === "normal"} // normal 일 때 on 이면 dark shadow
					round
				>
					{name}
				</Button>
			))}
			<ThemeButtonSet isOpen={activeButtons["Theme"]} />
		</ThemeDiv>
	);
};

export default PanelContent;