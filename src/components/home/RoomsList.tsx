import { Header, Icon, Image, Label, List } from "semantic-ui-react";
import { getRandomAvatar } from "../../common/utils";
import { useAuth } from "../../services/auth/AuthContext";
import { useChat } from "../../services/chat/chat-service";
import {
  getRoomDescription,
  getRoomTitle,
  sortRoomsByUnreadCount,
} from "../../services/chat/chat-utils";

import styles from "./RoomsList.module.scss";

const EmptyRoomsList = ({ username }: { username: string }) => (
  <div className={styles.emptyListContainer}>
    <Header as="h2" icon>
      <Icon name="hand peace" />
      Hii {username}
      <Header.Subheader>search for admin to chat with me</Header.Subheader>
    </Header>
  </div>
);

function RoomsList() {
  const { id, username } = useAuth();
  const { rooms, selectedRoom, selectRoom } = useChat();

  if (rooms.length === 0 && username !== undefined)
    return <EmptyRoomsList username={username} />;

  return (
    <List animated celled size="big" className={styles.roomsList}>
      {sortRoomsByUnreadCount(rooms).map((room) => (
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
                {room.unreadCount !== 0 && selectedRoom?.id !== room.id ? (
                  <div className={styles.unreadCountContainer}>
                    <Label color="red" floating circular>
                      {room.unreadCount}
                    </Label>
                  </div>
                ) : null}
              </List.Content>
            </div>
          </div>
        </List.Item>
      ))}
    </List>
  );
}

export { RoomsList };
