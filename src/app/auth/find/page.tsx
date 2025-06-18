'use client'

import Card from "@/components/Card";
import Button from "@/components/base/Button";
import { useState } from "react";
import FindEmail from "@/app/auth/find/forms/FindEmail";
import FindPassword from "@/app/auth/find/forms/FindPassword";
import AnimatedText from "@/components/base/AnimatedText";
import { useRouter } from "next/navigation";

type Pages = "FindEmail" | "FindPassword" | null;

const FindPage = () => {
	const [currentPage, setCurrentPage] = useState<Pages>(null);
	const router = useRouter();

	const handlePageChange = (page: Pages) => {
		if (currentPage === page) {
			setCurrentPage(null);
		} else {
			setCurrentPage(page);
		}
	}

	return (
		<Card
			hasLogo
			innerScroll
			backButton={
				<Button
					theme="dark"
					padding="px-3 py-1.5"
					onClick={() => router.push('/login')}
				>
					뒤로가기
				</Button>
			}
		>
			<div
				className={"my-4"}
			>
				<AnimatedText text={"어떤 도움이 필요하신가요?"} />
			</div>
			<div
				className={"w-full flex"}
			>
				<Button
					width={"w-[50%]"}
					padding={"px-1 py-2"}
					onClick={() => handlePageChange("FindEmail")}
					theme={"dark"}
					on={currentPage === "FindEmail"}
					className={"z-1"}
				>이메일 찾기</Button>
				<Button
					width={"w-[50%]"}
					padding={"px-1 py-2"}
					onClick={() => handlePageChange("FindPassword")}
					theme={"dark"}
					on={currentPage === "FindPassword"}
					className={"z-1"}
				>비밀번호 찾기</Button>
			</div>
			<div
				className={"w-full"}
			>
				{currentPage === "FindEmail" ? <FindEmail /> : currentPage === "FindPassword" ? <FindPassword /> : null}
			</div>
		</Card>
	);
};

export default FindPage;