import { Dropdown, GridColumn, Header, Search } from "semantic-ui-react";
import { RoomsList } from "./RoomsList";

import styles from "./SideBar.module.scss";

function SideBar() {
  return (
    <GridColumn computer={4} mobile={16}>
      <div className={styles.sideBarContainer}>
        <Header textAlign="center" size="huge">
          G Chat
        </Header>
        <div className={styles.searchBarContainer}>
          <Search
            placeholder="Search User . . ."
            // loading={searchLoading}
            // onResultSelect={onResultSelect}
            // onSearchChange={onSearchChange}
            // results={searchResult}
            // value={searchText}
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
