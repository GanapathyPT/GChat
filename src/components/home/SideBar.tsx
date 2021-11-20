import {
  Dropdown,
  GridColumn,
  Header,
  Icon,
  Image,
  Search,
} from "semantic-ui-react";
import { useUserSearch } from "../../services/auth/auth-services";
import { useAuth } from "../../services/auth/AuthContext";
import { useChat } from "../../services/chat/chat-service";
import { useA2HSButton } from "../../services/service-worker/add2hs-service";
import { RoomsList } from "./RoomsList";

import styles from "./SideBar.module.scss";

const Add2HSButton = () => {
  const { isPromptVisible, showPrompt } = useA2HSButton();
  if (!isPromptVisible) return null;

  return (
    <Dropdown.Item onClick={showPrompt}>
      <Icon name="download" />
      Install
    </Dropdown.Item>
  );
};

interface DropDownProps {
  logout: () => void;
}

const DropDownOptions = ({ logout }: DropDownProps) => (
  <Dropdown simple direction="left" icon="ellipsis vertical">
    <Dropdown.Menu>
      <Dropdown.Item onClick={logout}>
        <Icon name="power off" />
        Logout
      </Dropdown.Item>
      <Add2HSButton />
    </Dropdown.Menu>
  </Dropdown>
);

function SideBar() {
  const { username, logout } = useAuth();
  const {
    onResultSelect,
    onSearchChange,
    searchLoading,
    searchResult,
    searchText,
  } = useUserSearch();
  const { selectedRoom } = useChat();

  return (
    <GridColumn computer={4} mobile={16}>
      <div
        className={`${styles.sideBarContainer} ${
          selectedRoom ? styles.hidden : ""
        }`}
      >
        <div className={styles.headerContainer}>
          <Header as="h1">
            <Image circular src="/logo.png" className={styles.headerLogo} />
            <Header.Content>
              G Chat
              <Header.Subheader>{username}</Header.Subheader>
            </Header.Content>
          </Header>
          <DropDownOptions logout={logout} />
        </div>
        <Search
          placeholder="Search User . . ."
          loading={searchLoading}
          onResultSelect={onResultSelect}
          onSearchChange={onSearchChange}
          results={searchResult}
          value={searchText}
        />
        <RoomsList />
      </div>
    </GridColumn>
  );
}

export { SideBar };
