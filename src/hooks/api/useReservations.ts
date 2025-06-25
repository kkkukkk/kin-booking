import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Reservation} from "@/types/model/reservation";
import {CreateReservationDto} from "@/types/dto/reservation";
import {createReservation} from "@/api/reservation";

export const useCreateReservation = () => {
	const client = useQueryClient();

	return useMutation<Reservation, Error, CreateReservationDto>({
		mutationFn: createReservation,
		onSuccess: () => {
			client.invalidateQueries({queryKey: ['reservations']});
		},
		onError: (error: Error) => {
			console.error('reservations 생성 실패:', error.message);
		},
	});
}