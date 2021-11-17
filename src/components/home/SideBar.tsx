import { Dropdown, GridColumn, Header, Search } from "semantic-ui-react";
import { useUserSearch } from "../../services/auth/auth-services";
import { useChat } from "../../services/chat/chat-service";
import { RoomsList } from "./RoomsList";

import styles from "./SideBar.module.scss";

function SideBar() {
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
          <Dropdown simple direction="left" icon="ellipsis vertical">
            <Dropdown.Menu>
              <Dropdown.Item>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <RoomsList />
      </div>
    </GridColumn>
  );
}

export { SideBar };
