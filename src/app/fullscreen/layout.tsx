import React from "react";
import QueryProvider from "@/providers/QueryProvider";

const FullscreenLayout = ({ children }: { children: React.ReactNode }) => (
	<html lang="ko">
		<body className="min-h-screen bg-white">
			<QueryProvider>{children}</QueryProvider>
		</body>
	</html>
);

export default FullscreenLayout;