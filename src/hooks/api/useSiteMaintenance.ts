import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSiteMaintenanceEnabled, setSiteMaintenanceEnabled } from '@/api/siteMaintenance';
import { UpdateSiteMaintenanceDto } from '@/types/dto/siteMaintenance';

export const siteMaintenanceQueryKey = ['site_maintenance'] as const;

export const useSiteMaintenance = () => {
	return useQuery({
		queryKey: siteMaintenanceQueryKey,
		queryFn: fetchSiteMaintenanceEnabled,
		staleTime: 30 * 1000,
		retry: 1,
	});
};

export const useUpdateSiteMaintenance = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ enabled }: UpdateSiteMaintenanceDto) => setSiteMaintenanceEnabled(enabled),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: siteMaintenanceQueryKey });
		},
	});
};
