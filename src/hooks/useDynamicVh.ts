import { useEffect } from "react";

const useDynamicVh = () => {
	useEffect(() => {
		function setVh() {
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty("--vh", `${vh}px`);
		}
		setVh();
		window.addEventListener("resize", setVh);
		return () => window.removeEventListener("resize", setVh);
	}, [])
}

export default useDynamicVh;