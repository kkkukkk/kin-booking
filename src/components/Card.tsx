'use client'

import React, { useRef, useState, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import clsx from "clsx";
import Logo from "@/components/Logo";
import { fadeSlideY } from "@/types/ui/motionVariants";
import { motion, AnimatePresence } from "framer-motion";
import ScrollBar from "@/components/base/ScrollBar";
import useNeedScrollBar from "@/hooks/useNeedScrollBar";
import ThemeRefDiv from "@/components/base/ThemeRefDiv";
import useRehydrated from "@/hooks/useIsRehydrated";
import Footer from "@/components/Footer";

interface CardProps {
	children: React.ReactNode;
	className?: string;
	hasLogo?: boolean;
	backButton?: React.ReactNode;
	width?: string;
	height?: string;
	center?: boolean;
	innerScroll?: boolean;
	hasFooter?: boolean;
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
	hasFooter = false,
}: CardProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const rehydrated = useRehydrated();
	const scrollTargetRef = useRef<HTMLDivElement | null>(null);
	const [refReady, setRefReady] = useState(false);

	// ref가 설정되면 refReady를 true로
	useEffect(() => {
		if (rehydrated && scrollTargetRef.current) {
			setRefReady(true);
		}
	}, [rehydrated]);

	const needScrollBar = useNeedScrollBar(scrollTargetRef, rehydrated && refReady);
	const conditionStyle: React.CSSProperties = {};

	if (innerScroll) {
		conditionStyle.overflowY = "auto";
		conditionStyle.position = "relative";
	}

	return (
		<AnimatePresence mode="wait">
			<motion.div
				variants={fadeSlideY}
				initial="enter"
				animate="center"
				exit="exit"
				transition={{ duration: 0.3 }}
				className={clsx(
					"rounded-none md:rounded-[10px] max-w-7xl mx-auto",
					theme === "dark"
						? "shadow-[0_0_6px_rgba(255,255,255,0.7),0_0_12px_rgba(255,255,255,0.5),0_0_24px_rgba(255,255,255,0.3),0_0_36px_rgba(255,255,255,0.1)]"
						: theme === "neon"
							? "shadow-[0_0_6px_rgba(119,255,153,0.7),0_0_12px_rgba(119,255,153,0.5),0_0_24px_rgba(119,255,153,0.3),0_0_36px_rgba(119,255,153,0.2)]"
							: "shadow-[0_0_6px_rgba(0,0,0,0.7),0_0_12px_rgba(0,0,0,0.5),0_0_24px_rgba(0,0,0,0.3),0_0_36px_rgba(0,0,0,0.1)]",
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
						"w-full h-full rounded-none md:rounded-[10px] p-6 md:px-12 flex flex-col",
						center && "justify-center items-center",
						"scrollbar-none",
						"bg-transparent border-none backdrop-blur-sm",
						className
					)}
					style={{
						...conditionStyle,
						backgroundColor:
							theme === "dark" || theme === "neon"
								? "var(--black_70)"
								: "var(--white_70)",
					}}
				>
					{(backButton || hasLogo) && (
						<div className="flex w-full items-center justify-between pb-2">
							<div className="flex-1 flex justify-start items-start">{backButton || null}</div>
							<div className="flex-1 flex justify-center">
								{hasLogo && <Logo width={120} priority={true} />}
							</div>
							<div className="flex-1" />
						</div>
					)}
					<div className={clsx("flex-1 flex flex-col", center && "justify-center items-center")}>{children}</div>
					{/* Footer */}
					{hasFooter && <Footer theme={theme} />}
				</ThemeRefDiv>
				{innerScroll && needScrollBar && (
					<ScrollBar targetRef={scrollTargetRef} />
				)}
			</motion.div>
		</AnimatePresence>
	);
};

export default Card;