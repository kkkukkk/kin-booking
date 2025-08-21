export type SnakeCase<T> = {
	[K in keyof T as K extends string ? SnakeCaseKey<K> : K]: T[K]
};

export type CamelCase<T> = {
	[K in keyof T as K extends string ? CamelCaseKey<K> : K]: T[K]
};

// 키 문자열 변환
type SnakeCaseKey<S extends string> =
	S extends `${infer T}${infer U}`
	? U extends Uncapitalize<U>
	? `${Lowercase<T>}${SnakeCaseKey<U>}`
	: `${Lowercase<T>}_${SnakeCaseKey<U>}`
	: S;

type CamelCaseKey<S extends string> =
	S extends `${infer T}_${infer U}`
	? `${T}${Capitalize<CamelCaseKey<U>>}`
	: S;