import React from "react";
import { motion } from "framer-motion";
import { wordContainer, wordItem, iconItem } from "@/types/ui/motionVariants";
import clsx from "clsx";

interface AnimatedTextWithIconsProps {
	text: string;
	fontSize?: string;
	delay?: number;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
}

const AnimatedTextWithIcons = ({
	text,
	fontSize,
	delay = 0,
	leftIcon,
	rightIcon,
}: AnimatedTextWithIconsProps) => {
	const chars = text.split("");
	const staggerChildren = 0.05;
	const charAnimDuration = 0.15;
	const textAnimDuration = chars.length * staggerChildren + charAnimDuration; // 텍스트 총 애니메이션 시간

	return (
		<div className={clsx("inline-flex items-center", fontSize ? fontSize : "text-base md:text-lg")}>
			{leftIcon && (
				<motion.span
					initial="hidden"
					animate="visible"
					variants={iconItem(delay)}
					className="inline-flex mr-2"
					aria-hidden="true"
				>
					{leftIcon}
				</motion.span>
			)}

			<motion.div
				variants={wordContainer(delay)}
				initial="hidden"
				animate="visible"
				className={clsx(
					"inline-block",
					fontSize ? fontSize : "text-base md:text-lg"
				)}
			>
				{text.split("").map((char, index) => (
					<motion.span key={index} variants={wordItem}>
						{char}
					</motion.span>
				))}
			</motion.div>

			{rightIcon && (
				<motion.span
					initial="hidden"
					animate="visible"
					variants={iconItem(textAnimDuration + delay)}
					className="inline-flex ml-2"
					aria-hidden="true"
				>
					{rightIcon}
				</motion.span>
			)}
		</div>
	);
};


export default AnimatedTextWithIcons;
