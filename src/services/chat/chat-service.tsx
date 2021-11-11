import { useEffect, useState } from "react";
import { getApiInstance } from "../../common/APIInstance";

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Message {
  id: number;
  author: number;
  content: string;
}

export interface Room {
  id: number;
  title: string | null;
  users: User[];
  messages: Message[];
  last_message_id: number;
}

async function getRooms(): Promise<Room[]> {
  return (await getApiInstance().get("chat/rooms/")).data;
}

export function useChat() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number>();

  useEffect(() => {
    (async () => {
      const initialRooms = await getRooms();
      setRooms(initialRooms);
    })();
  }, []);

  const selectRoom = (id: number) => {
    setSelectedRoom(id);
  };

  return {
    rooms,
    selectedRoom,
    selectRoom,
  };
}
