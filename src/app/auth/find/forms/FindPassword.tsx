import ThemeDiv from "@/components/base/ThemeDiv";
import { motion } from "framer-motion";
import { tabs } from "@/types/ui/motionVariants";

const FindPassword = () => {
	return (
		<ThemeDiv
			className={"p-2 rounded-md text-sm md:text-base"}
		>
			<motion.div
				variants={tabs}
				initial="initial"
				animate="animate"
				exit="exit"
			>
				패스워드
			</motion.div>
		</ThemeDiv>
	);
};

export default FindPassword;