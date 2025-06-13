'use client'

import {useEffect, useState} from "react";
import Image from "next/image";

interface ImageSliderProps {
	images: string[],
	interval?: number,
	width?: string,
	height?: string,
}

const ImageSlider = ({
	images,
	interval = 5000,
	width = "w-full",
	height = "h-full",
}: ImageSliderProps) => {
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		const id = setInterval(() => {
			setCurrent((prev) => (prev + 1) % images.length);
		}, interval);
		return () => clearInterval(id);
	}, [images.length, interval]);

	return (
		<div className={`relative overflow-hidden ${width} ${height} rounded`}>
			{images.map((url, index) => (
				<Image
					key={index}
					src={url}
					alt={`slide-${index}`}
					fill
					className={`object-cover transition-opacity duration-1000 ease-in-out ${
						current === index ? "opacity-100" : "opacity-0"
					}`}
				/>
			))}
		</div>
	);
};

export default ImageSlider;
