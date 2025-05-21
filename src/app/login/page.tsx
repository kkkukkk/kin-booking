import { Input } from "@/components/ui/Input";

const LoginPage = () => {
	return (
		<div>
			<Input placeholder="작은 입력창" size="sm" />
			<Input placeholder="중간 입력창" />
			<Input placeholder="큰 입력창 (가로 길이 고정)" size="lg" fullWidth={false} className="w-64" />
		</div>
	)
}

export default LoginPage;