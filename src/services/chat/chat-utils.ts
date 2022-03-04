import { deepCopy } from "../../common/utils";
import { Message, Room } from "./chat-service";

interface RoomWithUnreadCount extends Room {
  unreadCount: number;
}

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

export function sortRoomsByUnreadCount(rooms: Room[]): RoomWithUnreadCount[] {
  const roomsCopy: Room[] = deepCopy(rooms);
  const roomsWithUnreadCount = roomsCopy.map((room) => ({
    ...room,
    unreadCount: getUnreadCount(room),
  }));
  return roomsWithUnreadCount.sort(
    (room1, room2) => room2.unreadCount - room1.unreadCount
  );
}

export function getDateFromDateTime(dateTime: string, separator = "-") {
  const date = new Date(dateTime);
  return `${date.getDate()}${separator}${date.getMonth()}${separator}${date.getFullYear()}`;
}

export function getMessageTime(createdAt: string): string {
  const dateTime = new Date(createdAt);
  const hours = dateTime.getHours() === 12 ? 12 : dateTime.getHours() % 12;
  return `${hours}:${dateTime.getMinutes()}`;
}

export function groupMessagesByDate(messages: Message[]) {
  const groupedMessages: [string, Message[]][] = [];

  messages.forEach((message) => {
    const date = getDateFromDateTime(message.created_at);

    const oldIndex = groupedMessages.findIndex((val) => val[0] === date);
    if (oldIndex !== -1) groupedMessages[oldIndex][1].push(message);
    else groupedMessages.push([date, [message]]);
  });

  return groupedMessages;
}
