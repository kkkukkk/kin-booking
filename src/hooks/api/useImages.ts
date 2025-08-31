import { fetchLoginImages } from "@/api/image";
import { useQuery } from "@tanstack/react-query";

export const useLoginImages = () => {
	return useQuery<string[]>({
		queryKey: ['login-images'],
		queryFn: () => fetchLoginImages(),
		staleTime: 0, // 즉시 stale로 처리
		gcTime: 0, // 캐시 비활성화
		retry: 1,
		refetchOnMount: true, // 컴포넌트 마운트 시 항상 새로고침
		refetchOnWindowFocus: true, // 윈도우 포커스 시 새로고침
		refetchOnReconnect: true, // 네트워크 재연결 시 새로고침
	});
}

