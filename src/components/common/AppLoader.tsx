import { Dimmer, Loader } from "semantic-ui-react";

function AppLoader() {
  return (
    <Dimmer active inverted>
      <Loader />
    </Dimmer>
  );
}

export { AppLoader };
