'use client'

import Image from "next/image";
import clsx from "clsx";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

interface LogoProps {
	width?: number; // 너비만 받아서 비율 맞춰 높이 자동 계산
	className?: string;
}

const Logo = ({ width, className }: LogoProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);

	// 기본 크기와 비율
	const defaultWidth = 450;
	const defaultHeight = 330;

	// width가 없으면 기본값, height는 비율 맞춰서 계산
	const computedWidth = width ?? defaultWidth;
	const computedHeight = (computedWidth / defaultWidth) * defaultHeight;

	return (
		<div
			className={clsx(
				className,
				"w-full h-full flex justify-center items-center"
			)}
		>
			<div
				className={"relative"}
				style={{
					width: computedWidth,
					height: computedHeight,
				}}
			>
				<Image
					key={theme}
					src={`/images/logo_${theme}.png`}
					alt="logo"
					fill
					style={{ objectFit: "contain" }}
					priority
				/>
			</div>
		</div>
	);
};

export default Logo;