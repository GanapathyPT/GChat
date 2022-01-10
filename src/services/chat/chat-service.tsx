import { useCallback, useEffect } from "react";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { getApiInstance } from "../../common/APIInstance";
import { deepCopy } from "../../common/utils";
import { AuthStatus, useAuth } from "../auth/AuthContext";
import { getLastMessageInRoom, getSelectedRoomAndUpdate } from "./chat-utils";

const POLLER_INTERVAL = 1000;

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Message {
  id: number;
  author: number;
  content: string;
  created_at: string;
}

export interface Room {
  id: number;
  title: string | null;
  users: User[];
  messages: Message[];
  last_read_message: number;
}

interface RoomList {
  room_id: number;
  last_message: number;
}

export async function addNewRoom(users: number[]): Promise<Room> {
  return (
    await getApiInstance().post("chat/add_room/", {
      users,
    })
  ).data;
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
  room_list: RoomList[]
): Promise<Record<number, Message[]>> {
  return (await getApiInstance().post("chat/get_new_messages/", { room_list }))
    .data;
}

async function markAsRead(room_id: number, last_read_message: number) {
  return (
    await getApiInstance().post("chat/mark_as_read/", {
      room_id,
      last_read_message,
    })
  ).data;
}

let roomsFetched = false;
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
  const [rooms, setRooms] = useRecoilState(roomsState);
  const setRoomList = useSetRecoilState(roomListState);
  const [selectedRoom, setSelectedRoom] = useRecoilState(selectedRoomState);

  useEffect(() => {
    (async () => {
      if (roomsFetched) return;

      // first setting is to true
      // reason: if useChat is called all at once,
      // the delay from the server makes it not possible to call only once
      roomsFetched = true;
      const initialRooms = await getRooms();
      setRooms(initialRooms);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const newRoomsList: RoomList[] = rooms.map((room) => {
      const lastMessage = getLastMessageInRoom(room);
      return {
        room_id: room.id,
        last_message: lastMessage !== undefined ? lastMessage.id : -1,
      };
    });
    setRoomList(newRoomsList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooms]);

  const selectRoom = useCallback(
    async (selectedRoomId: number) => {
      setSelectedRoom(selectedRoomId);

      const roomsCopy: Room[] = getSelectedRoomAndUpdate(
        rooms,
        selectedRoomId,
        (room) => {
          const lastMessage = getLastMessageInRoom(room);
          return {
            ...room,
            last_read_message: lastMessage !== undefined ? lastMessage.id : -1,
          };
        }
      );
      setRooms(roomsCopy);
      const selectedRoomObj = roomsCopy.find(
        (room) => room.id === selectedRoomId
      );
      if (
        selectedRoomObj === undefined ||
        selectedRoomObj.last_read_message === -1
      )
        return;
      await markAsRead(selectedRoomId, selectedRoomObj.last_read_message);
    },
    [rooms, setRooms, setSelectedRoom]
  );

  const deSelectRoom = useCallback(() => {
    setSelectedRoom(undefined);
  }, [setSelectedRoom]);

  const addMessage = useCallback(
    async (message: string) => {
      if (selectedRoom === undefined) return;

      // let's not update locally
      // let's get the message from poller
      const { id } = await sendNewMessage(message, selectedRoom);
      // but need to change the last read message in rooms array
      setRooms((oldRooms) =>
        getSelectedRoomAndUpdate(oldRooms, selectedRoom, (room) => ({
          ...room,
          last_read_message: id,
        }))
      );
    },
    [setRooms, selectedRoom]
  );

  const addRoom = useCallback(
    (room: Room) => {
      setRooms((oldRooms) => [...oldRooms, room]);
      setSelectedRoom(room.id);
    },
    [setRooms, setSelectedRoom]
  );

  const getRoomIfAlreadyThere = useCallback(
    (userId: number) =>
      rooms.find(
        (room) =>
          room.users.length === 2 &&
          room.users.some((user) => user.id === userId)
      ),
    [rooms]
  );

  const resetStates = useCallback(() => {
    roomsFetched = false;
    setRooms([]);
    setRoomList([]);
    setSelectedRoom(undefined);
  }, [setSelectedRoom, setRoomList, setRooms]);

  return {
    rooms,
    selectedRoom: rooms.find((room) => room.id === selectedRoom),
    selectRoom,
    addRoom,
    deSelectRoom,
    addMessage,
    resetStates,
    getRoomIfAlreadyThere,
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
        // get new messages for all the rooms
        const newMessages = await getNewMessages(roomList);
        // if no new messages are there do nothing
        if (!Object.values(newMessages).some((room) => room.length > 0)) return;

        setRooms((rooms) => {
          const oldRooms: Room[] = deepCopy(rooms);
          Object.keys(newMessages).forEach((key) => {
            const roomId = parseInt(key);
            // no new messages for the room
            if (newMessages[roomId].length === 0) return;

            // get the index of room in rooms array
            const roomIndex = oldRooms.findIndex((room) => room.id === roomId);
            // push the new messages to the messages array of rooms
            oldRooms[roomIndex].messages.push(...newMessages[roomId]);
            // these message are not yet read
            // so don't need to change the last_read_message in rooms
          });
          return oldRooms;
        });
      }, POLLER_INTERVAL);
      return () => clearInterval(poller);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, roomList]);
}
