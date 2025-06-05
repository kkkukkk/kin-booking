'use client'

import Input from "@/components/base/Input";
import Card from "@/components/Card";
import Button from "@/components/base/Button";
import useAlert from "@/hooks/useAlert";
import {useEffect} from "react";

const LoginPage = () => {

	const { showAlert, hideAlert } = useAlert();
	const handleClick = () => {
		showAlert({ type: "toast", message: "저장되었습니다!", autoCloseTime: 3000});
	}
	return (
		<Card className={"flex flex-col gap-2"}>
			<Input placeholder="입력창" theme={"normal"} className={"input-base"} />
			<Input placeholder="입력창" theme={"dark"} className={"input-base"} />
			<Input placeholder="입력창" theme={"neon"} className={"input-base"} />
			<Input placeholder="입력창" theme={"normal"} className={"input-base"} variant={"underline"} />
			<Input placeholder="입력창" theme={"dark"} className={"input-base"} variant={"underline"} />
			<Input placeholder="입력창" theme={"neon"} className={"input-base"} variant={"underline"} error/>
			<Button
				type="button"
				theme={"dark"}
				onClick={() => handleClick()}
			>
				{"Alert Test"}
			</Button>
		</Card>
	)
}

export default LoginPage;