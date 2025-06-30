import Card from "@/components/Card";
import EventReservationClient from "@/app/events/[eventId]/reservation/components/EventReservationClient";

const EventReservationPage = () => {
	return (
		<Card
			innerScroll
		>
			<EventReservationClient />
		</Card>
	);
};

export default EventReservationPage;