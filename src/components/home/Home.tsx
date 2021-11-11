import { Grid, GridRow } from "semantic-ui-react";
import { useChatPoller } from "../../services/chat/chat-service";
import { ChatRoom } from "./ChatRoom";
import { SideBar } from "./SideBar";

function Home() {
  useChatPoller();

  return (
    <Grid columns="two" divided>
      <GridRow>
        <SideBar />
        <ChatRoom />
      </GridRow>
    </Grid>
  );
}

export { Home };
