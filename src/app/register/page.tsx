import Card from "@/components/Card";
import RegisterClient from "@/app/register/components/RegisterClient";

const RegisterPage = () => {
	return (
		<Card
			innerScroll
			className="md:max-w-[80%] mx-auto"
		>
			<RegisterClient />
		</Card>
	);
};

export default RegisterPage;