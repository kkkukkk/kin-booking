'use client'

import React from "react";
import {useAppSelector} from "@/redux/hooks";
import {RootState} from "@/redux/store";
import clsx from "clsx";
import styles from '@/css/module/card.module.css';
import ThemeDiv from "@/components/base/ThemeDiv";
import Logo from "@/components/Logo";
import {fadeSlideY} from "@/types/ui/motionVariants";
import {motion, AnimatePresence} from "framer-motion";

interface CardProps {
	children: React.ReactNode;
	className?: string;
	hasLogo?: boolean;
	width?: string;
	height?: string;
	center?: boolean
}

const Card = ({
	children,
	className,
	hasLogo = false,
	width = "w-full",
	height = "h-full",
	center = false,
}: CardProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);

	return (
		<AnimatePresence mode="wait">
			<motion.div
				variants={fadeSlideY}
				initial="enter"
				animate="center"
				exit="exit"
				transition={{duration: 0.3}}
				className={clsx("relative main-center", width, height)}
			>
				<ThemeDiv
					className={clsx(
						styles.card,
						theme && styles[theme],
						className,
						center && "flex justify-center items-center"
					)}
				>
					{hasLogo && <Logo className={"relative top-0 left-[50%] w-[120px] h-auto translate-x-[-50%]"}/>}
					{children}
				</ThemeDiv>
			</motion.div>
		</AnimatePresence>
	);
};

export default Card;