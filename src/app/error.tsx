'use client'
import Card from "@/components/Card";
import {useRouter} from "next/navigation";
import Button from "@/components/base/Button";

const ErrorPage = () => {
	const router = useRouter();
	return (
		<Card center>
			<div className={'text-lg'}>
				{"에러가 발생했습니다."}
			</div>
			<Button
				theme={"dark"}
				className={'mt-4'}
				onClick={() => router.push('/')}
			>홈으로</Button>
		</Card>
	);
}

export default ErrorPage