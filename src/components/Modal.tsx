'use client'

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import ThemeDiv from "@/components/base/ThemeDiv";
import clsx from "clsx";
import { fadeSlideY } from "@/types/ui/motionVariants";
import { motion } from "framer-motion";

interface ModalProps {
	children: React.ReactNode;
	onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

	// 스크롤 위치 고정
	useEffect(() => {
		const originalStyle = window.getComputedStyle(document.body).overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = originalStyle;
		};
	}, []);

	const modalContent = (
		<motion.div
			className="fixed inset-0 w-full h-screen flex justify-center items-center bg-black/50 z-50"
			initial={{opacity: 0}}
			animate={{opacity: 1}}
			exit={{opacity: 0}}
			onClick={onClose}
		>
			<motion.div
				variants={fadeSlideY}
				initial="enter"
				animate="center"
				exit="exit"
				transition={{duration: 0.3}}
				className="relative"
				onClick={(e) => e.stopPropagation()}
			>
				<ThemeDiv className={clsx("p-4 rounded shadow-lg min-w-[300px] max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto")} isChildren>
					<button
						className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
						onClick={onClose}
						aria-label="닫기"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
						     className="bi bi-x-lg" viewBox="0 0 16 16">
							<path
								d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
						</svg>
					</button>
					{children}
				</ThemeDiv>
			</motion.div>
		</motion.div>
	);

	// 포털을 사용하여 document.body에 직접 렌더링
	return typeof window !== 'undefined' 
		? createPortal(modalContent, document.body)
		: modalContent;
}

export default Modal;