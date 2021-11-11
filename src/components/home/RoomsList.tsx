import { Image, List } from "semantic-ui-react";
import { getRandomAvatar } from "../../common/utils";
import { useAuth } from "../../services/auth/AuthContext";
import { useChat } from "../../services/chat/chat-service";
import {
  getRoomDescription,
  getRoomTitle,
} from "../../services/chat/chat-utils";

import styles from "./RoomsList.module.scss";

function RoomsList() {
  const { id } = useAuth();
  const { rooms, selectedRoom, selectRoom } = useChat();

  return (
    <List animated celled size="big">
      {rooms.map((room) => (
        <List.Item
          key={room.id}
          onClick={() => selectRoom(room.id)}
          style={{ padding: 0 }}
        >
          <div className={room.id === selectedRoom ? styles.active : ""}>
            <div className={styles.roomItem}>
              <div className={styles.profilePic}>
                <Image avatar src={getRandomAvatar(String(room.id))} />
              </div>
              <List.Content>
                <List.Header>{getRoomTitle(room, id)}</List.Header>
                <List.Description>
                  <p className={styles.description}>
                    {getRoomDescription(room)}
                  </p>
                </List.Description>
              </List.Content>
            </div>
          </div>
        </List.Item>
      ))}
    </List>
  );
}

export { RoomsList };
