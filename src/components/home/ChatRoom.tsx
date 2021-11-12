import { memo, useEffect, useRef, useState } from "react";
import { Button, GridColumn, Icon, Input, Segment } from "semantic-ui-react";
import { useAuth } from "../../services/auth/AuthContext";
import { Message, useChat } from "../../services/chat/chat-service";

import styles from "./ChatRoom.module.scss";

const ChatList = memo(
  ({ messages }: { messages: Message[] }) => {
    const { id } = useAuth();
    return (
      <>
        {messages.map((message) => (
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
      </>
    );
  },
  ({ messages: prevMessages }, { messages: newMessages }) =>
    prevMessages.length === newMessages.length &&
    prevMessages[prevMessages.length - 1] ===
      newMessages[newMessages.length - 1]
);

function ChatRoom() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { selectedRoom, deSelectRoom, addMessage } = useChat();
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (bottomRef.current !== null) {
      bottomRef.current.scrollIntoView();
    }
  }, [selectedRoom, selectedRoom?.messages]);

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
          <ChatList messages={selectedRoom.messages} />
          <div ref={bottomRef} />
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
