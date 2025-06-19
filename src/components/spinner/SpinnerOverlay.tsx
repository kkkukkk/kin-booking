"use client";

import React, { useEffect, useState, memo } from "react";
import ReactDOM from "react-dom";
import styles from "@/css/module/spinner-overlay.module.css";
import Spinner from "@/components/spinner/Spinner";

interface SpinnerOverlayProps {
	withBackgroundImage?: boolean;
}

const SpinnerOverlay = memo(({ withBackgroundImage = false }: SpinnerOverlayProps) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return ReactDOM.createPortal(
		<div
			className={styles.overlay}
			data-background={withBackgroundImage ? "image" : "none"}
		>
			<div className={styles.backdrop} />
			<div className={styles.spinnerWrapper}>
				<Spinner />
			</div>
		</div>,
		document.body
	);
});

SpinnerOverlay.displayName = "SpinnerOverlay";

export default SpinnerOverlay;