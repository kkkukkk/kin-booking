import { supabase } from "@/lib/supabaseClient";

export const fetchLoginImages = async (): Promise<string[]> => {
	const { data, error } = await supabase.storage
	.from("kin")
	.list("login-slide", {
		limit: 100,
		offset: 0,
		sortBy: { column: "name", order: "asc" },
	});

	if (error) {
		console.error(error);
		return [];
	}

	return data
	.filter((file) => file.name) // 혹시 null 걸러내기
	.map(
		(file) =>
			`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/kin/login-slide/${file.name}`
	);
};