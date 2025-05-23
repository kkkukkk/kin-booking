import React from "react";
import styles from "@/css/module/spinner-overlay.module.css";
import Spinner from "@/components/Spinner";

const SpinnerOverlay = () => {
	return (
		<div className={styles.overlay}>
			<div className={styles.backdrop} />
			<div className={styles.spinnerWrapper}>
				<Spinner />
			</div>
		</div>
	);
};

export default SpinnerOverlay;