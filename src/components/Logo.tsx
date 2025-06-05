'use client'

import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";

interface LogoProps {
	className?: string
}

const Logo = ({className}: LogoProps) => {
	const router = useRouter();
	const theme = useAppSelector((state: RootState) => state.theme.current);

	return (
		<div className={clsx("relative", className)}>
			<Image
				src={`/images/logo_${theme}.png`}
				alt="logo"
				fill
				onClick={() => router.push('/')}
				className={clsx("object-contain cursor-pointer")}
			/>
		</div>
	)
}

export default Logo;