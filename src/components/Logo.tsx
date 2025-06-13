import Image from "next/image";
import clsx from "clsx";
import {useAppSelector} from "@/redux/hooks";
import {RootState} from "@/redux/store";

interface LogoProps {
	width?: number; // 너비만 받아서 비율 맞춰 높이 자동 계산
	className?: string;
}

const Logo = ({ width = 450, className }: LogoProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);

	return (
		<div
			className={clsx(
				"w-full max-w-[450px] aspect-[450/330] relative",
				className
			)}
		>
			<Image
				key={theme}
				src={`/images/logo_${theme}.png`}
				alt="logo"
				fill
				style={{ objectFit: "contain" }}
				sizes={`${width}px`}
				priority
			/>
		</div>
	);
};

export default Logo;