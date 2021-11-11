import { useState } from "react";
import { Button, GridColumn, Icon, Input, Segment } from "semantic-ui-react";
import { useAuth } from "../../services/auth/AuthContext";
import { useChat } from "../../services/chat/chat-service";

import styles from "./ChatRoom.module.scss";

function ChatRoom() {
  const { id } = useAuth();
  const { selectedRoom, deSelectRoom, addMessage } = useChat();
  const [newMessage, setNewMessage] = useState("");

  if (selectedRoom === undefined) return null;
  return (
    <GridColumn computer={12} mobile={16}>
      <Segment className={styles.chatRoomContainer}>
        <Icon
          className={styles.backButton}
          name="arrow left"
          size="big"
          onClick={deSelectRoom}
        />
        <div className={styles.messagesContainer}>
          {selectedRoom?.messages.map((message) => (
            <p
              key={message.id}
              className={`${styles.chatMessage} ${
                message.author === id ? styles.ourMessage : ""
              }`}
            >
              <span>
                {message.content}
                {/* <small>{getTime(message.createdAt)}</small> */}
              </span>
            </p>
          ))}
          {/* <div ref={ref} /> */}
        </div>
        <Input
          autoFocus
          value={newMessage}
          onKeyPress={(e: any) => {
            if (e.charCode === 13) {
              addMessage(e.target.value);
              setNewMessage("");
            }
          }}
          onChange={(e) => setNewMessage(e.target.value)}
          label={
            <Button
              primary
              icon
              active
              onClick={() => {
                addMessage(newMessage);
                setNewMessage("");
              }}
            >
              <Icon name="send" />
            </Button>
          }
          labelPosition="right"
          placeholder="Type anything . . ."
        />
      </Segment>
    </GridColumn>
  );
}

export { ChatRoom };
