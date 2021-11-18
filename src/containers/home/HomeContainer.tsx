import { useEffect } from "react";
import { Home } from "../../components/home/Home";
import { useChat, useChatPoller } from "../../services/chat/chat-service";
import { useServiceWorker } from "../../services/service-worker/service-worker-service";

function HomeContainer() {
  useChatPoller();
  useServiceWorker();
  const { resetStates } = useChat();

  // cleanup function when user logout
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => resetStates, []);

  return <Home />;
}

export { HomeContainer };
