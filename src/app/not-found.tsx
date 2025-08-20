import Card from "@/components/Card";
import Link from "next/link";
import Button from "@/components/base/Button";

const NotFound = () => {
	return (
		<Card center>
			<div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-2">
				<h1 className="text-6xl font-bold mb-4">404</h1>
				<h2 className="text-2xl font-semibold mb-4">
					페이지를 찾을 수 없습니다
				</h2>
				<p className="mb-8 max-w-md">
					요청하신 페이지가 존재하지 않거나 이동되었습니다.
				</p>
				<Link href="/">
					<Button
						theme="dark"
						className="px-6 py-3 font-semibold"
						padding="px-6 py-3"
					>
						홈으로 돌아가기
					</Button>
				</Link>
			</div>
		</Card>
	);
}

export default NotFound