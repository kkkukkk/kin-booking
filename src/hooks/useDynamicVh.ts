import {useEffect} from "react";

const useDynamicVh = () => {
	useEffect(() => {
		function setVh() {
			console.log("window.innerHeight:", window.innerHeight);
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty("--vh", `${vh}px`);
			console.log(vh);
		}
		setVh();
		window.addEventListener("resize", setVh);
		return () => window.removeEventListener("resize", setVh);
	}, [])
}

export default useDynamicVh;