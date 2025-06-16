'use client'

import React from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import clsx from "clsx";
import styles from '@/css/module/card.module.css';
import ThemeDiv from "@/components/base/ThemeDiv";
import Logo from "@/components/Logo";
import { fadeSlideY } from "@/types/ui/motionVariants";
import { motion, AnimatePresence } from "framer-motion";

interface CardProps {
	children: React.ReactNode;
	className?: string;
	hasLogo?: boolean;
	width?: string;
	height?: string;
	center?: boolean;
	innerScroll?: boolean;
}

const Card = ({
	children,
	className,
	hasLogo = false,
	width = "w-full",
	height = "h-full",
	center = false,
	innerScroll = false,
}: CardProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const conditionStyle = {
		...(innerScroll && { overflowY: "auto" }),
		...(hasLogo && { paddingTop: 0 }),
	};

	return (
		<AnimatePresence mode="wait">
			<motion.div
				variants={fadeSlideY}
				initial="enter"
				animate="center"
				exit="exit"
				transition={{duration: 0.3}}
				className={clsx(
					"relative main-center",
					width,
					height
				)}
				style={
					innerScroll
						? { maxHeight: "100%", overflow: "hidden" }
						: undefined
				}
			>
				<ThemeDiv
					className={clsx(
						styles.card,
						theme && styles[theme],
						className,
						center && "flex justify-center items-center",
					)}
					style={conditionStyle}
				>
					{hasLogo &&
					    <div className={"sticky top-0 z-10 flex w-full justify-center pt-[1.5rem]"}>
						    <Logo width={120}/>
					    </div>
					}
					{children}
				</ThemeDiv>
			</motion.div>
		</AnimatePresence>
	);
};

export default Card;