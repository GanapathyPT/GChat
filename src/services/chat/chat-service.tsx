import { useEffect } from "react";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { getApiInstance } from "../../common/APIInstance";
import { AuthStatus, useAuth } from "../auth/AuthContext";

const POLLER_INTERVAL = 5000;

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

interface RoomList {
  id: number;
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

async function getNewMessages(
  rooms: RoomList[]
): Promise<Record<number, Message[]>> {
  return (await getApiInstance().post("chat/get_new_messages/", { rooms }))
    .data;
}

const roomsState = atom<Room[]>({
  default: [],
  key: "rooms",
});

const selectedRoomState = atom<number | undefined>({
  default: undefined,
  key: "selectedRoom",
});

const roomListState = atom<RoomList[]>({
  default: [],
  key: "roomList",
});

export function useChat() {
  const { id } = useAuth();
  const [rooms, setRooms] = useRecoilState(roomsState);
  const setRoomList = useSetRecoilState(roomListState);
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

  useEffect(() => {
    const newRoomsList = rooms.map((room) => ({
      id: room.id,
      last_message_id: room.last_message_id,
    }));
    setRoomList(newRoomsList);
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

let poller: any;

export function useChatPoller() {
  const { status } = useAuth();
  const setRooms = useSetRecoilState(roomsState);
  const roomList = useRecoilValue(roomListState);

  useEffect(() => {
    if (status === AuthStatus.Authenticated && roomList.length > 0) {
      poller = setInterval(async () => {
        const newMessages = await getNewMessages(roomList);
        setRooms((rooms) => {
          const oldRooms: Room[] = JSON.parse(JSON.stringify(rooms));
          Object.keys(newMessages).forEach((key) => {
            const roomId = parseInt(key);
            const room = oldRooms.findIndex((room) => room.id === roomId);
            oldRooms[room].messages.push(...newMessages[roomId]);
          });
          return oldRooms;
        });
      }, POLLER_INTERVAL);
      return () => clearInterval(poller);
    }
  }, [status, roomList]);
}
