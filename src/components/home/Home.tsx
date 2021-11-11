import { Grid, GridRow } from "semantic-ui-react";
import { ChatRoom } from "./ChatRoom";
import { SideBar } from "./SideBar";

function Home() {
  return (
    <Grid columns="two" divided>
      <GridRow>
        <SideBar />
      </GridRow>
    </Grid>
  );
}

export { Home };
