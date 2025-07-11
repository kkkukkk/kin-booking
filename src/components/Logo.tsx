'use client'

import Image from "next/image";
import clsx from "clsx";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

interface LogoProps {
	width?: number; // 너비만 받아서 비율 맞춰 높이 자동 계산
	className?: string;
	priority?: boolean; // priority를 선택적으로 설정할 수 있도록
	variant?: 'theme' | 'white'; // 테마 기반 또는 흰색 버전
}

const Logo = ({ width, className, priority = false, variant = 'theme' }: LogoProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);

	// 기본 크기와 비율
	const defaultWidth = 450;
	const defaultHeight = 330;

	// width가 없으면 기본값, height는 비율 맞춰서 계산
	const computedWidth = width ?? defaultWidth;
	const computedHeight = (computedWidth / defaultWidth) * defaultHeight;

	// 반응형 sizes 설정
	const sizes = computedWidth <= 200 ? "200px" : 
				  computedWidth <= 400 ? "400px" : 
				  `${computedWidth}px`;

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
					key={`${theme}-${variant}`}
					src={variant === 'white' ? '/images/logo_dark.webp' : `/images/logo_${theme}.webp`}
					alt="logo"
					fill
					sizes={sizes}
					style={{ objectFit: "contain" }}
					priority={priority}
					loading={priority ? "eager" : "lazy"}
				/>
			</div>
		</div>
	);
};

export default Logo;