'use client'

import useAlert from "@/hooks/useAlert";
import ThemeDiv from "@/components/base/ThemeDiv";
import Toast from "@/components/alert/Toast";

const Alert = () => {
	const {
		isOpen,
		type,
		message,
		inputValue,
		setInputValue,
		hideAlert,
	} = useAlert();

	// toast는 별도 컴포넌트로 분기
	if (type === 'toast') {
		return <Toast />;
	}

	if (!isOpen) return null;

	return (
		<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-50">
			<ThemeDiv
				className="bg-white p-6 rounded-md shadow-lg min-w-[300px] max-w-[90%]"
			>
				<p className="mb-4">{message}</p>

				{type === 'prompt' && (
					<input
						type="text"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						className="border border-gray-300 rounded px-2 py-1 w-full mb-4"
					/>
				)}

				<div className="flex justify-end gap-2">
					<button onClick={hideAlert} className="text-gray-600">취소</button>
					<button onClick={hideAlert} className="text-blue-600 font-bold">확인</button>
				</div>
			</ThemeDiv>
		</div>
	);
};

export default Alert;