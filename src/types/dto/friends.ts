import { Friends, FriendStatus } from "@/types/model/friends";

export interface FriendWithUser extends Friends {
	friend: {
		id: string;
		name: string;
		email: string;
	};
}

export interface CreateFriendRequest {
	friendId: string;
}

export interface UpdateFriendRequest {
	status: FriendStatus;
}

export interface FriendRequestsData {
	received: FriendRequest[];
	sent: FriendRequest[];
}

export interface FriendRequest {
	id: string;
	fromUserId: string;
	toUserId: string;
	status: FriendStatus;
	createdAt: string;
	fromUser: {
		id: string;
		name: string;
		email: string;
	};
	toUser: {
		id: string;
		name: string;
		email: string;
	};
}