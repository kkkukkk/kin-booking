const toSnakeCase = (str: string) =>
	str.replace(/([A-Z])/g, '_$1').toLowerCase();

const toCamelCase = (str: string) =>
	str.replace(/_([a-z])/g, (_, char) => char.toUpperCase());

export function toSnakeCaseKeys<T>(obj: unknown): T {
	if (Array.isArray(obj)) {
		return obj.map(item => toSnakeCaseKeys(item)) as T;
	}
	if (obj && typeof obj === 'object') {
		const result: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(obj)) {
			const snakeKey = toSnakeCase(key);
			result[snakeKey] = toSnakeCaseKeys(value);
		}
		return result as T;
	}
	return obj as T;
}

export function toCamelCaseKeys<T>(obj: unknown): T {
	if (Array.isArray(obj)) {
		return obj.map(item => toCamelCaseKeys(item)) as T;
	}

	if (obj && typeof obj === 'object') {
		const result: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(obj)) {
			const camelKey = toCamelCase(key);
			result[camelKey] = toCamelCaseKeys(value);
		}
		return result as T;
	}

	return obj as T;
}