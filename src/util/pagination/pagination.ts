import { PaginationInfo, PaginationParams, PaginationRange } from "@/util/pagination/type";

export const getPaginationRange = (
	params: PaginationParams,
): PaginationRange => {
	const page = params.page ?? 1;
	const size = params.size ?? 10;

	const start = (page - 1) * size;
	const end = start + size - 1;

	return { start, end };
}

export const getPaginationResponse = (
	params: PaginationParams,
	totalCount: number,
): PaginationInfo => {
	const page = Math.max(params.page ?? 1, 1);
	const size = Math.max(params.size ?? 10, 1);

	const totalPages = Math.ceil(totalCount / size);
	const hasPrev = page > 1;
	const hasNext = page < totalPages;

	return {
		page,
		size,
		totalPages,
		hasPrev,
		hasNext,
	}
}
