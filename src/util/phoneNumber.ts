export const formatPhoneNumber = (phoneNumber: string | null | undefined): string => {
	if (!phoneNumber) return '미등록';

	// 숫자만 추출
	const numbers = phoneNumber.replace(/\D/g, '');

	// 길이에 따라 포맷팅
	if (numbers.length === 11) {
		// 010-1234-5678 형식
		return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
	} else if (numbers.length === 10) {
		// 010-123-4567 형식
		return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
	} else if (numbers.length === 9) {
		// 010-123-456 형식
		return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
	}

	// 기타 형식은 그대로 반환
	return phoneNumber;
}; 