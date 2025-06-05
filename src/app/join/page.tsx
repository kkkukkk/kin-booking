'use client'

import { useEffect, useState } from "react";
import LoginPage from "@/app/join/forms/LoginPage";
import RegisterPage from "@/app/join/forms/RegisterPage";
import { notFound } from "next/navigation";

type Pages = "LoginPage" | "RegisterPage"

const JoinPage = () => {
	useEffect(() => {
		notFound();
	}, [])

	const [currentPage, setCurrentPage] = useState<Pages>("LoginPage")

	const handlePageChange = (page: Pages) => {
		setCurrentPage(page);
	};

	return (
		<>
			{currentPage === "LoginPage" ? (
				<LoginPage onSwitch={() => handlePageChange("RegisterPage")}/>
			) : (
				<RegisterPage onSwitch={() => handlePageChange("LoginPage")}/>
			)}
		</>
	)
}

export default JoinPage;