import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { getApiInstance } from "../../common/APIInstance";
import { useAuth } from "../auth/AuthContext";

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

async function sendNewMessage(content: string, room: number) {
  return (
    await getApiInstance().post("chat/new_message/", {
      content,
      room,
    })
  ).data;
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
  const { id } = useAuth();
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

  const deSelectRoom = () => {
    setSelectedRoom(undefined);
  };

  const addMessage = async (message: string) => {
    if (selectedRoom === undefined || id === undefined) return;
    let newMessage: Message = await sendNewMessage(message, selectedRoom);
    newMessage = {
      ...newMessage,
      author: id,
    };
    setRooms((rooms) =>
      rooms.map((room) =>
        room.id === selectedRoom
          ? {
              ...room,
              messages: [...room.messages, newMessage],
            }
          : room
      )
    );
  };

  return {
    rooms,
    selectedRoom: rooms.find((room) => room.id === selectedRoom),
    selectRoom,
    deSelectRoom,
    addMessage,
  };
}
