export const getErrorMessage = (error: unknown) => {
	if (typeof error === 'object' && error !== null && 'message' in error) {
		return (error as { message: string }).message;
	}
	return String(error);
}