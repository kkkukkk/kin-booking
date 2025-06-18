'use client'

import React, { useRef } from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import clsx from "clsx";
import styles from '@/css/module/card.module.css';
import Logo from "@/components/Logo";
import { fadeSlideY } from "@/types/ui/motionVariants";
import { motion, AnimatePresence } from "framer-motion";
import ScrollBar from "@/components/base/ScrollBar";
import useNeedScrollBar from "@/hooks/useNeedScrollBar";
import ThemeRefDiv from "@/components/base/ThemeRefDiv";
import useRehydrated from "@/hooks/useIsRehydrated";

interface CardProps {
	children: React.ReactNode;
	className?: string;
	hasLogo?: boolean;
	backButton?: React.ReactNode;
	width?: string;
	height?: string;
	center?: boolean;
	innerScroll?: boolean;
}

const Card = ({
	children,
	className,
	hasLogo = false,
	backButton,
	width = "w-full",
	height = "h-full",
	center = false,
	innerScroll = false,
}: CardProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const rehydrated = useRehydrated();
	const scrollTargetRef = useRef<HTMLDivElement>(null);
	const needScrollBar = useNeedScrollBar(scrollTargetRef, rehydrated);
	const conditionStyle = {
		...(innerScroll && { overflowY: "auto", position: "relative" }),
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
					styles["card-wrap"],
					theme && styles[theme],
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
				<ThemeRefDiv
					ref={scrollTargetRef}
					className={clsx(
						styles.card,
						theme && styles[theme],
						className,
						center && "flex justify-center items-center",
						"scrollbar-none"
					)}
					style={conditionStyle}
				>
					{(backButton || hasLogo) && (
						<div className="flex w-full items-center justify-between pb-2">
							<div className="flex-1 flex justify-start items-start">{backButton || null}</div>
							<div className="flex-1 flex justify-center">
								{hasLogo && <Logo width={120} />}
							</div>
							<div className="flex-1" />
						</div>
					)}
					{children}
				</ThemeRefDiv>
				{innerScroll && needScrollBar && (
					<ScrollBar targetRef={scrollTargetRef} />
				)}
			</motion.div>
		</AnimatePresence>
	);
};

export default Card;