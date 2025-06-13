interface SkeletonProps {
	width?: string;
	height?: string;
	className?: string;
}

const Skeleton = ({ width = "w-full", height = "h-full", className = "" }: SkeletonProps) => {
	return (
		<div
			className={`${width} ${height} bg-gray-300 animate-pulse rounded ${className}`}
		/>
	);
};

export default Skeleton;