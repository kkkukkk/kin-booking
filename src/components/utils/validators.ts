export const isValidEmail = (email: string): boolean => {
	const trimmed = email.trim();
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
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