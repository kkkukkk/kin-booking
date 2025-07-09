import { Friends } from "@/types/model/friends";

export interface FriendWithUser extends Friends {
	isMyRequest: boolean;    // 내가 요청 보낸 사람인지 여부

	// 상대방 user
	counterpartUserId: string;
	counterpartName: string;
	counterpartEmail: string;
}

export interface FriendResponse {
	sent: FriendWithUser[];
	received: FriendWithUser[];
}

export interface CreateFriendRequest {
	friendId: string;
}