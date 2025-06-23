'use client'

import React from 'react';
import SearchBar from "@/components/search/SearchBar";
import EventList from "@/app/events/components/EventList";
import { EventStatus, EventStatusKo } from "@/types/model/events";

const statusOptions = [
	{ value: '', label: '전체' },
	...Object.values(EventStatus).map(status => ({
		value: status,
		label: EventStatusKo[status],
	}))
];

const EventClient = () => {
	const [eventDateFrom, setEventDateFrom] = React.useState('');
	const [eventDateTo, setEventDateTo] = React.useState('');
	const [keyword, setKeyword] = React.useState('');
	const [status, setStatus] = React.useState('');

	return (
		<div>
			<SearchBar
				filters={{
					keyword: {
						value: keyword,
						onChange: setKeyword,
						placeholder: '공연 이름',
					},
					dateRange: {
						from: eventDateFrom,
						to: eventDateTo,
						onChange: (from, to) => {
							setEventDateFrom(from);
							setEventDateTo(to);
						},
					},
					status: {
						value: status,
						onChange: setStatus,
						options: statusOptions,
					},
				}}
			/>
			<EventList
				className={"mt-4"}
				keyword={keyword}
				status={status}
				from={eventDateFrom}
				to={eventDateTo}
			/>
		</div>
	);
};

export default EventClient;