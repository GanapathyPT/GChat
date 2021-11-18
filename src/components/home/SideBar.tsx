import { Dropdown, GridColumn, Header, Search } from "semantic-ui-react";
import { useUserSearch } from "../../services/auth/auth-services";
import { useAuth } from "../../services/auth/AuthContext";
import { useChat } from "../../services/chat/chat-service";
import { useA2HSButton } from "../../services/service-worker/add2hs-service";
import { RoomsList } from "./RoomsList";

import styles from "./SideBar.module.scss";

const Add2HSButton = () => {
  const { isPromptVisible, showPrompt } = useA2HSButton();
  if (!isPromptVisible) return null;

  return <Dropdown.Item onClick={showPrompt}>Install</Dropdown.Item>;
};

interface DropDownProps {
  logout: () => void;
}

const DropDownOptions = ({ logout }: DropDownProps) => (
  <Dropdown simple direction="left" icon="ellipsis vertical">
    <Dropdown.Menu>
      <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
      <Add2HSButton />
    </Dropdown.Menu>
  </Dropdown>
);

function SideBar() {
  const { logout } = useAuth();
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
        <Header textAlign="center" size="huge">
          G Chat
        </Header>
        <div className={styles.searchBarContainer}>
          <Search
            className={styles.searchBar}
            placeholder="Search User . . ."
            loading={searchLoading}
            onResultSelect={onResultSelect}
            onSearchChange={onSearchChange}
            results={searchResult}
            value={searchText}
          />
          <DropDownOptions logout={logout} />
        </div>
        <RoomsList />
      </div>
    </GridColumn>
  );
}

export { SideBar };
