import React, { useState } from "react";
import clsx from "clsx";
import Input from "@/components/base/Input";
import ToggleVisibilityIcon from "@/components/icon/ToggleVisibilityIcon";
import { InputProps } from "@/types/ui/input";

const InputWithPasswordToggle = ({
	theme = "normal",
	variant = "box",
	error = false,
	fontSize,
	fontWeight,
	className,
	type = "password",
	...rest
}: InputProps) => {
	const [visible, setVisible] = useState(false);

	const isPasswordType = type === "password";

	return (
		<div className="relative w-full">
			<Input
				{...rest}
				type={isPasswordType && visible ? "text" : type}
				theme={theme}
				variant={variant}
				error={error}
				fontSize={fontSize}
				fontWeight={fontWeight}
				className={clsx("pr-10", className)} // 오른쪽 여백 확보
			/>
			{isPasswordType && (
				<button
					type="button"
					onClick={() => setVisible((prev) => !prev)}
					className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer opacity-30 hover:opacity-60"
					aria-label={visible ? "Hide password" : "Show password"}
					tabIndex={-1}
				>
					<ToggleVisibilityIcon visible={visible} />
				</button>
			)}
		</div>
	);
};

export default InputWithPasswordToggle;