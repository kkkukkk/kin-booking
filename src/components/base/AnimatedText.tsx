import { motion } from "framer-motion";
import {wordContainer, wordItem} from "@/types/ui/motionVariants";
import clsx from "clsx";

interface AnimatedTextProps {
	text: string;
	fontSize?: string;
	delay?: number;
}

const AnimatedText = ({ text, fontSize, delay = 0 }: AnimatedTextProps) => {
	return (
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
	);
};

export default AnimatedText;