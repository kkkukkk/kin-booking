'use client';

import React, { useState, useRef, useEffect } from "react";
import Button from "@/components/base/Button";
import PanelContent from "@/components/panel/PanelContent";

const TogglePanel = () => {
	const [open, setOpen] = useState(false);
	const [activeButtons, setActiveButtons] = useState<{ [key: string]: boolean }>({});
	const panelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				open &&
				panelRef.current &&
				!panelRef.current.contains(event.target as Node)
			) {
				setOpen(false);
				setActiveButtons({}); // 모든 버튼 비활성화
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [open]);

	return (
		<div className="fixed bottom-3.5 right-3.5 flex flex-col items-end gap-2 md:bottom-5 md:right-5" ref={panelRef}>
			<PanelContent
				isOpen={open}
				activeButtons={activeButtons}
				setActiveButtons={setActiveButtons}
			/>
			<Button
				round
				onClick={() => {
					if (open) setActiveButtons({});
					setOpen(!open);
				}}
				fontSize={"text-[10px] md:text-base"}
				on={open}
				theme="neon"
				style={{
					opacity: open ? "1" : "0.6",
					border: "1px solid rgba(255,255,255,.3)",
				}}
			>
				{open ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						style={{ display: 'block', margin: '0 auto' }} // 가운데 정렬
					>
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				) : (
					"KIN"
				)}
			</Button>
		</div>
	);
};

export default TogglePanel;