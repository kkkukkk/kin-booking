export interface PaginationParams {
	page?: number;
	size?: number;
}

export interface PaginationRange {
	start: number;
	end: number;
}

export interface PaginationInfo {
	page: number;
	size: number;
	totalPages: number;
	hasPrev: boolean;
	hasNext: boolean;
}