'use client'

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Button from "@/components/base/Button";
import ThemeDiv from "@/components/base/ThemeDiv";
import ThemeButtonSet from "@/components/panel/ThemeButtonSet";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { HomeIcon } from "@/components/icon/HomeIcon";
import { UsersIcon } from "@/components/icon/FriendIcons";
import { useLogout } from "@/hooks/api/useAuth";
import { useSession } from "@/hooks/useSession";
import useToast from "@/hooks/useToast";
import { useAlert } from "@/providers/AlertProvider";

type PanelContentProps = {
	isOpen: boolean;
	activeButtons:{ [key: string]: boolean };
	setActiveButtons: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
};

// 공통 패널 스타일
const PANEL_STYLES = {
	base: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex flex-col gap-2 p-2 rounded-full shadow-md z-10000 transition-all duration-300 ease-out",
	open: "opacity-100 scale-100 pointer-events-auto",
	closed: "opacity-0 scale-95 pointer-events-none"
} as const;

const PanelContent = ({ isOpen, activeButtons, setActiveButtons }: PanelContentProps) => {
	const router = useRouter();
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const { mutate: logout } = useLogout();
	const { session } = useSession();
	const { showToast } = useToast();
	const { showAlert } = useAlert();

	const toggleButton = useCallback((key: string) => {
		const skipKeys = ["Home", "Login", "Logout"];
		if (skipKeys.includes(key)) return;
		setActiveButtons((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	}, [setActiveButtons]);

	const handleLogout = useCallback(async () => {
		const confirmed = await showAlert({
			type: 'confirm',
			title: '로그아웃',
			message: '정말 로그아웃하시겠습니까?',
		});
		
		if (confirmed) {
			logout(undefined, {
				onSuccess: () => {
					showToast({
						iconType: 'success',
						message: '로그아웃 되었습니다.',
						autoCloseTime: 3000
					});
					router.push("/login?loggedOut=1");
				},
			});
		}
	}, [logout, showToast, router, showAlert]);

	const panelButtons = useMemo(() => [
		{
			key: 'Theme',
			order: 1,
			onClick: () => {},
			name: 'Theme',
		},
		{
			key: 'Home',
			order: 3,
			onClick: () => router.push("/"),
			name: <HomeIcon />
		},
		...(session
			? [
				{
					key: 'My',
					order: 2,
					onClick: () => router.push("/my"),
					name: <UsersIcon />
				},
				{
					key: 'Logout',
					order: 4,
					onClick: handleLogout,
					name: 'Logout',
				},
			]
			: [
				{
					key: 'Login',
					order: 4,
					onClick: () => router.push('/login'),
					name: 'Login',
				},
			]),
	].sort((a, b) => a.order - b.order), [session, router, handleLogout]);

	const buttonTheme = theme !== "normal" ? theme : "dark";
	const buttonReverse = theme === "normal";

	return (
		<ThemeDiv
			className={clsx(
				PANEL_STYLES.base,
				isOpen ? PANEL_STYLES.open : PANEL_STYLES.closed
			)}
			style={{ width: "fit-content" }}
		>
			{panelButtons.map(({ key, onClick, name }) => (
				<Button
					key={key}
					theme={buttonTheme}
					onClick={() => {
						toggleButton(key);
						onClick();
					}}
					fontSize="text-[10px] md:text-xs"
					on={activeButtons[key]}
					round
					reverse={buttonReverse}
					className={clsx(
						key === 'Home' && 'home-button',
						key === 'My' && 'my-page-button',
						key === 'Logout' && 'logout-button'
					)}
				>
					{name}
				</Button>
			))}
			<ThemeButtonSet isOpen={activeButtons["Theme"]} />
		</ThemeDiv>
	);
};

export default PanelContent;