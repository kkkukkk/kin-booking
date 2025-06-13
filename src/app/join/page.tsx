'use client'

import { useEffect, useState } from "react";
import LoginPage from "@/app/join/forms/LoginPage";
import RegisterPage from "@/app/join/forms/RegisterPage";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";

type Pages = "LoginPage" | "RegisterPage"

const JoinPage = () => {
	const { session, loading } = useSession();
	const [currentPage, setCurrentPage] = useState<Pages>("LoginPage");
	const router = useRouter();

	useEffect(() => {
		if (!loading && session) {
			const isEmailVerified = !!session.user.email_confirmed_at;
			if (isEmailVerified) {
				router.replace("/");
			}
		}
	}, [loading, session, router]);

	if (loading) return null;

	const handlePageChange = (page: Pages) => {
		setCurrentPage(page);
	};

	return (
		<>
			{currentPage === "LoginPage" ? (
				<LoginPage onSwitch={() => handlePageChange("RegisterPage")} />
			) : (
				<RegisterPage onSwitch={() => handlePageChange("LoginPage")} />
			)}
		</>
	)
}

export default JoinPage;