import { useEffect } from "react";
import { Home } from "../../components/home/Home";
import { useChat, useChatPoller } from "../../services/chat/chat-service";

function HomeContainer() {
  const { resetStates } = useChat();
  useChatPoller();

  // cleanup function when user logout
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => resetStates, []);

  return <Home />;
}

export { HomeContainer };
