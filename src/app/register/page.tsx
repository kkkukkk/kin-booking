import Card from "@/components/Card";
import RegisterClient from "@/app/register/components/RegisterClient";

const RegisterPage = () => {
	return (
		<Card
			innerScroll
			className="mx-auto"
			width="w-[80%]"
		>
			<RegisterClient />
		</Card>
	);
};

export default RegisterPage;