import { deepCopy } from "../../common/utils";
import { Message, Room } from "./chat-service";

export function getRoomTitle(room: Room, currentUserId?: number) {
  if (room.title !== null) return room.title;

  const userId = room.users[0].id;
  if (userId === currentUserId) return room.users[1].username;

  return room.users[0].username;
}

export function getRoomDescription(room: Room) {
  const lastMessage = getLastMessageInRoom(room);
  if (lastMessage === undefined) return "Tap to start the conversation";
  return lastMessage.content;
}

export function getLastMessageInRoom(room: Room): Message | undefined {
  if (room.messages.length === 0) return;
  const lastMessage = room.messages[room.messages.length - 1];
  return lastMessage;
}

export function getSelectedRoomAndUpdate(
  rooms: Room[],
  selectedRoomId: number,
  roomUpdate: (room: Room) => Room
) {
  return rooms.map((room) =>
    room.id === selectedRoomId
      ? {
          ...room,
          ...roomUpdate(deepCopy(room)),
        }
      : room
  );
}

export function getUnreadCount(room: Room): number {
  if (room.messages.length === 0) return 0;
  const lastReadMessageIndex = room.messages.findIndex(
    (message) => message.id === room.last_read_message
  );
  return room.messages.length - lastReadMessageIndex - 1;
}
