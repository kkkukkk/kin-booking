export const fadeSlideUp = {
	hidden: { y: 50, opacity: 0 },
	visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
	exit: { y: 50, opacity: 0, transition: { duration: 0.5 } },
};

export const fadeSlideDown = {
	hidden: { y: -50, opacity: 0 },
	visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
	exit: { y: -50, opacity: 0, transition: { duration: 0.5 } },
};

export const fadeSlideLeft = {
	hidden: { x: 50, opacity: 0 },
	visible: { x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.3 } },
	exit: { x: 50, opacity: 0, transition: { duration: 0.5 } },
};

export const fadeSlideRight = {
	hidden: { x: -50, opacity: 0 },
	visible: { x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.3 } },
	exit: { x: -50, opacity: 0, transition: { duration: 0.5 } },
};

export const fadeSlideX = {
	enter: { opacity: 0, x: 100 },
	center: { opacity: 1, x: 0, transition: { duration: 0.5 } },
	exit: { opacity: 0, x: -100, transition: { duration: 0.5 } },
}

export const fadeSlideY = {
	enter: { opacity: 0, y: 50 },
	center: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	exit: { opacity: 0, y: -50, transition: { duration: 0.5 } },
};

export const fadeSlideDownSm = {
	enter: { opacity: 0, y: -10 },
	center: { opacity: 1, y: 0, transition: { duration: 0.3 } },
	exit: { opacity: 0, y: 10, transition: { duration: 0.3 } },
};

export const textContainer = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.6, // 문장들 사이 등장 시간 간격
		},
	},
};

export const textContainerItem = {
	hidden: { opacity: 0, y: 10 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const consent = {
	initial: { opacity: 0, x: 50 },
	animate: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 1.8 } },
	exit: { opacity: 0, x: -50, transition: { duration: 0.5 } },
}

export const bottomUp = {
	initial: { opacity: 0, y: 50 },
	animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5 } },
	exit: { opacity: 0, y: -50, transition: { duration: 0.5 } },
}

export const bottomUpDelay = {
	initial: { opacity: 0, y: 50 },
	animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 2.4} },
	exit: { opacity: 0, y: 50, transition: { duration: 0.5 } },
}

export const wordContainer = (delay = 0) => ({
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.05,
			delayChildren: delay,
		},
	},
});

export const wordItem = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.15 } },
};

export const iconItem = (customDelay = 0) => ({
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: customDelay } },
});

export const tabs = {
	initial: { opacity: 0, y: 10 },
	animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	exit: { opacity: 0, y: -10, transition: { duration: 0.5 } },
}
