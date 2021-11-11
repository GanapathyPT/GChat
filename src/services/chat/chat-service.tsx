import { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";
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

const roomsState = atom<Room[]>({
  default: [],
  key: "rooms",
});

const selectedRoomState = atom<number | undefined>({
  default: undefined,
  key: "selectedRoom",
});

export function useChat() {
  const [rooms, setRooms] = useRecoilState(roomsState);
  const [selectedRoom, setSelectedRoom] = useRecoilState(selectedRoomState);

  useEffect(() => {
    (async () => {
      if (rooms.length === 0) {
        const initialRooms = await getRooms();
        setRooms(initialRooms);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooms]);

  const selectRoom = (id: number) => {
    setSelectedRoom(id);
  };

  return {
    rooms,
    selectedRoom: rooms.find((room) => room.id === selectedRoom),
    selectRoom,
  };
}
