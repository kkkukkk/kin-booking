export const fadeSlideUp = {
	hidden: { y: 30, opacity: 0 },
	visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
	exit: { y: 30, opacity: 0, transition: { duration: 0.3 } },
};

export const fadeSlideDown = {
	hidden: { y: -30, opacity: 0 },
	visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
	exit: { y: -30, opacity: 0, transition: { duration: 0.3 } },
};

export const fadeSlideLeft = {
	hidden: { x: 50, opacity: 0 },
	visible: { x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.3 } },
	exit: { x: 50, opacity: 0, transition: { duration: 0.3 } },
};

export const fadeSlideRight = {
	hidden: { x: -50, opacity: 0 },
	visible: { x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.3 } },
	exit: { x: -50, opacity: 0, transition: { duration: 0.3 } },
};

export const fadeSlideX = {
	enter: { opacity: 0, x: 100 },
	center: { opacity: 1, x: 0, transition: { duration: 0.3 } },
	exit: { opacity: 0, x: -100, transition: { duration: 0.3 } },
}

export const fadeSlideY = {
	enter: { opacity: 0, y: 30 },
	center: { opacity: 1, y: 0, transition: { duration: 0.3 } },
	exit: { opacity: 0, y: -30, transition: { duration: 0.3 } },
};

export const textContainer = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.7, // 문장들 사이 등장 시간 간격
		},
	},
};

export const textContainerItem = {
	hidden: { opacity: 0, y: 10 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const consent = {
	initial: { opacity: 0, x: 50 },
	animate: { opacity: 1, x: 0, transition: { duration: 0.3, delay: 2.1} },
	exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
}

export const bottomUp = {
	initial: { opacity: 0, y: 30 },
	animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
	exit: { opacity: 0, y: -30, transition: { duration: 0.3 } },
}

export const bottomUpDelay = {
	initial: { opacity: 0, y: 30 },
	animate: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 2.5} },
	exit: { opacity: 0, y: 30, transition: { duration: 0.3 } },
}
