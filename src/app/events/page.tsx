import Card from "@/components/Card";
import EventClient from "@/app/events/components/EventClient";

const EventsPage = () => {

	return (
		<Card
			hasLogo
			innerScroll
			hasFooter
		>
			<EventClient />
		</Card>
	);
};

export default EventsPage;