import Card from "@/components/Card";
import EventDetailClient from "@/app/events/[eventId]/components/EventDetailClient";

const EventDetailPage = () => {
	return (
		<Card
			innerScroll
		>
			<EventDetailClient />
		</Card>
	)
};

export default EventDetailPage;