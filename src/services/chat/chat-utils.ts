import { Room } from "./chat-service";

export function getRoomTitle(room: Room, currentUserId?: number) {
  if (room.title !== null) return room.title;

  const userId = room.users[0].id;
  if (userId === currentUserId) return room.users[1].username;

  return room.users[0].username;
}

export function getRoomDescription(room: Room) {
  if (room.messages.length === 0) return "Tap to start the conversation";
  const lastMessage = room.messages[room.messages.length - 1];
  return lastMessage.content;
}
