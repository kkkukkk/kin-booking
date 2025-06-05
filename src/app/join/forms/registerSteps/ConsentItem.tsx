import ThemeDiv from "@/components/base/ThemeDiv";
import Button from "@/components/base/Button";
import CheckBoxWithLabel from "@/components/base/CheckBoxWithLabel";

interface ConsentItemProps {
	checked: boolean;
	label: string;
	onClickDetail: () => void;
	required?: boolean;
}

const ConsentItem = ({ checked, label, onClickDetail, required }: ConsentItemProps) => (
	<ThemeDiv
		className="flex items-center justify-between px-2 py-1 rounded text-sm md:text-xl md:py-1.5"
		onClick={onClickDetail}
	>
		<CheckBoxWithLabel checked={checked} label={label} required={required} />
		<Button theme="dark" fontSize="text-xs md:text-sm" padding="p-2">
			자세히 보기
		</Button>
	</ThemeDiv>
);

export default ConsentItem;