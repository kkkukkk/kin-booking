'use client'

import React, {useState} from 'react';
import SearchBar from "@/components/search/SearchBar";
import EventList from "@/app/events/components/EventList";
import { EventStatus, EventStatusKo } from "@/types/model/events";

const statusOptions = [
	{ value: '', label: '전체' },
	...Object.values(EventStatus).map((status) => ({
		value: status,
		label: EventStatusKo[status],
	})),
] satisfies { value: EventStatus | ''; label: string }[];

const EventClient = () => {
	const [eventDateFrom, setEventDateFrom] = useState('');
	const [eventDateTo, setEventDateTo] = useState('');
	const [keyword, setKeyword] = useState('');
	const [status, setStatus] = useState<EventStatus | ''>('');

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
						value: status ?? '',
						onChange: (value: string) => setStatus(value as EventStatus | ''),
						options: statusOptions,
					},
				}}
			/>
			<EventList
				className={"mt-4"}
				keyword={keyword}
				status={status === '' ? undefined : status}
				from={eventDateFrom}
				to={eventDateTo}
			/>
		</div>
	);
};

export default EventClient;