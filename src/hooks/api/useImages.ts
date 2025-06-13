import { fetchLoginImages } from "@/api/image";
import { useQuery } from "@tanstack/react-query";

export const useLoginImages = () => {
	return useQuery<string[]>({
		queryKey: ['login-images'],
		queryFn: () => fetchLoginImages(),
		staleTime: 1000 * 60 * 10,
	});
}

