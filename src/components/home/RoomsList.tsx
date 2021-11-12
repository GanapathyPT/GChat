import { Image, Label, List } from "semantic-ui-react";
import { getRandomAvatar } from "../../common/utils";
import { useAuth } from "../../services/auth/AuthContext";
import { useChat } from "../../services/chat/chat-service";
import {
  getRoomDescription,
  getRoomTitle,
  getUnreadCount,
} from "../../services/chat/chat-utils";

import styles from "./RoomsList.module.scss";

function RoomsList() {
  const { id } = useAuth();
  const { rooms, selectedRoom, selectRoom } = useChat();

  return (
    <List animated celled size="big">
      {rooms.map((room) => {
        const unreadCount = getUnreadCount(room);

        return (
          <List.Item
            key={room.id}
            onClick={() => selectRoom(room.id)}
            style={{ padding: 0 }}
          >
            <div className={room.id === selectedRoom?.id ? styles.active : ""}>
              <div className={styles.roomItem}>
                <div className={styles.profilePic}>
                  <Image avatar src={getRandomAvatar(`${room.id}_${id}`)} />
                </div>
                <List.Content>
                  <List.Header>{getRoomTitle(room, id)}</List.Header>
                  <List.Description>
                    <p className={styles.description}>
                      {getRoomDescription(room)}
                    </p>
                  </List.Description>
                  {/* not showing count on selected room (hacky fix) */}
                  {unreadCount !== 0 && selectedRoom?.id !== room.id ? (
                    <div className={styles.unreadCountContainer}>
                      <Label color="red" floating circular>
                        {getUnreadCount(room)}
                      </Label>
                    </div>
                  ) : null}
                </List.Content>
              </div>
            </div>
          </List.Item>
        );
      })}
    </List>
  );
}

export { RoomsList };
