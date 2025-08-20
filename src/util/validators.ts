export const isValidEmail = (email: string): boolean => {
	const trimmed = email.trim();
	
	// 기본 형식 검사
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
		return false;
	}
	
	// @ 기준으로 분리
	const [localPart, domain] = trimmed.split('@');
	
	// 로컬 파트 검사 (1-64자, 특수문자 제한)
	if (!localPart || localPart.length > 64 || localPart.length < 1) {
		return false;
	}
	
	// 도메인 검사 (1-253자, 최소 2개 레벨)
	if (!domain || domain.length > 253 || domain.length < 3) {
		return false;
	}
	
	// 도메인에 최소 1개의 점이 있어야 함
	if (!domain.includes('.')) {
		return false;
	}
	
	// 도메인 레벨별 길이 검사 (각 레벨은 1-63자)
	const domainParts = domain.split('.');
	if (domainParts.some(part => part.length === 0 || part.length > 63)) {
		return false;
	}
	
	// 도메인 시작과 끝이 점이면 안됨
	if (domain.startsWith('.') || domain.endsWith('.')) {
		return false;
	}
	
	return true;
};

export const isValidName = (name: string): boolean => {
	const trimmed = name.trim();
	return /^[가-힣]{2,}$/.test(trimmed) || /^[a-zA-Z]{2,}$/.test(trimmed);
};

export const isValidPassword = (password: string): boolean => {
	const trimmed = password.trim();
	return /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/.test(trimmed);
};

export const isValidPhoneNumber = (phone: string): boolean => {
	const digits = phone.replace(/[^0-9]/g, '');
	return /^(010|011|016|017|018|019)\d{7,8}$/.test(digits);
};