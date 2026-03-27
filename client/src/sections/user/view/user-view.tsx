/*
  Author: André Kreienbring
  Main View for the user management. 
  Presents a table with all users and a button to create a new user.
  From here users can be created, updated, deleted and devices can be assigned.
  The 'main admin' with userid=1 can not be deleted from this view.
*/

import type { User } from '@src/types/user';
import type { Device } from '@src/types/device';

import { useTranslation } from 'react-i18next';
import { useShelly } from '@src/hooks/use-shelly';
import { mapNumberToMax } from '@src/utils/general';
import { emptyRows, getComparator } from '@src/utils/sort-array';
import { subscribeEvent, unsubscribeEvent } from '@src/events/pubsub';
import { useRef, type JSX, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import CreateUser from '../create-user';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { applyUserFilter } from '../user-table-utils';

// ----------------------------------------------------------------------

/**
 * Renders the user management view with a table of all users and a button to create a new user.
 * @returns {JSX.Element}
 */
export default function UserView(): JSX.Element {
  const [page, setPage] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { t } = useTranslation();
  const { request, user, isTest } = useShelly();
  const [openCreate, setOpenCreate] = useState(false);
  const isUsersLoaded = useRef(false);
  const [showReallyDelete, setShowReallyDelete] = useState(false);
  const [rowCount, setRowCount] = useState(
    // remmove administrators from the users list.
    user!.roleid === 1 && user!.userid !== 1 ? users.length - 2 : users.length - 1
  );
  const [devices, setDevices] = useState<Device[]>([]);

  /**
   * Will be called when devices were received via websocket from shellybroker.
   * @param {object} msg The message with a 'devices-get-all' event.
   */
  const handleDevicesReceived = useCallback((msg: SrvAnswerMsg) => {
    if (typeof msg.data.devices !== 'undefined') setDevices(msg.data.devices);
  }, []);

  /**
    The received users will be mapped to the table values.
    Called when users arrive due to a request send to the websocket server.
    Also called when a user was deleted and the server sends an updated list.
    Also passed to the CreateUser Component and called when a user was created.
    @param {object} msg A ws message that contains the users sent by the servers
  */
  const handleUsersReceived = useCallback(
    (msg: SrvAnswerMsg) => {
      const serverUsers = msg.data.users;
      if (typeof serverUsers !== 'undefined') {
        const clientUsers = serverUsers.map((serverUser: User) => ({
          userid: serverUser.userid,
          uuid: serverUser.uuid,
          avatarUrl: `/assets/images/avatars/avatar_${mapNumberToMax(serverUser.userid, 25)}.jpg`,
          alias: serverUser.alias,
          firstname: serverUser.firstname,
          lastname: serverUser.lastname,
          role: serverUser.role,
          email: serverUser.email,
          home: serverUser.home,
          roleid: serverUser.roleid,
        }));
        isUsersLoaded.current = true;
        setUsers(clientUsers);
        setRowCount(
          user!.roleid === 1 && user!.userid !== 1 ? clientUsers.length - 2 : clientUsers.length - 1
        );
      }
      setSelected([]);
    },
    [user]
  );

  /**
    Called when a user was updated. Updates the
    list of users. Is called from the UserForm
    @param {object} updateuser The user that was updated
  */
  const handleUpdateUser = useCallback(
    (updateuser: User) => {
      const updatedUsers = [...users];
      const index = updatedUsers.findIndex((x) => x.userid === updateuser.userid);
      updatedUsers[index] = updateuser;
      updatedUsers[index].avatarUrl =
        `/assets/images/avatars/avatar_${mapNumberToMax(updateuser.userid, 25)}.jpg`;

      setUsers(updatedUsers);
    },
    [users]
  );

  /*
    If a user is updated from the Account popover, then an
    event signals that this view must update the list of users.
  */
  const handleUpdateUserEvent = useCallback(
    (e: CustomEvent) => {
      if (e !== null) handleUpdateUser(e.detail);
    },
    [handleUpdateUser]
  );

  // --------------------- Websocket Implementation BEGIN----------------
  /*
    Upon mounting the userView sends a request for all users to the server. 
    The server answers and the response is handled accordingly.
  */
  useEffect(() => {
    const requestMsg: CliRequestMsg = {
      event: 'devices-get-all',
      source: 'UserView',
      message: 'UserView needs the list of devices',
      data: {
        userid: user!.roleid != 1 ? user!.userid : undefined, //an admin gets all devices
        istest: isTest,
      },
    };
    request(requestMsg, handleDevicesReceived);

    subscribeEvent('userUpdated', handleUpdateUserEvent as EventListener);

    if (!isUsersLoaded.current) {
      const requestMsg2: CliRequestMsg = {
        event: 'users-get-all',
        source: 'Users View',
        message: 'User View needs the list of users',
        data: {},
      };
      request(requestMsg2, handleUsersReceived);
    }

    return () => {
      // cleanup on unmount: unsubscribe from the event
      unsubscribeEvent('userUpdated', handleUpdateUserEvent as EventListener);
    };
  }, [request, handleUpdateUserEvent, handleUsersReceived, user, handleDevicesReceived, isTest]);
  // --------------------- Websocket Implementation END------------------

  /*
    Open / Close the UserCreate Dialog
  */
  const handleOpenCreate = () => {
    setOpenCreate(true);
  };
  const handleCloseCreate = () => {
    setOpenCreate(false);
  };

  /**
    Controls the really delete button in the table toolbar
    @param {boolean} show Show the 'really delete' menue item or not
  */
  const handleShowReallyDelete = (show: boolean) => {
    setShowReallyDelete(show);
  };

  /**
   * Sorts the table by a certain user property
   * @param {string} id The user property to sort the table (e.g. name)
   */
  const handleTableSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    if (property !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    }
  };

  /*
    Add all users except the Admin to the selection. 
  */
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = users
        .filter((u) => u.userid !== 1 && user!.userid !== u.userid)
        .map((u) => u.alias);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
    setShowReallyDelete(false);
  };

  /**
    When a checkbox of the user table is clicked, 
    this function creates an array of selected aliases
    @param {object} e The event
    @param {string} alias The alias of a user that must be added to the selection
  */
  const handleClick = (alias: string) => {
    const selectedIndex = selected.indexOf(alias);
    let newSelected: string[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, alias);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    setShowReallyDelete(false);
  };

  /**
    Called from within the table row popover, when a user
    must be deleted. Send a delete request to the server.
    The server responds with an updated list of users.
    @param {number} userid The id of the user that must be deleted
  */
  const handleDeleteUser = (userid: number) => {
    const requestMsg: CliRequestMsg = {
      event: 'user-delete',
      source: 'Users View',
      message: 'User View wants to delete a user',
      data: {
        ids: [userid],
      },
    };
    request(requestMsg, handleUsersReceived);
  };

  /**
    Called from within the table toolbar
    Delete all selected users. The Admin is excluded!
    The server responds with an updated list of users.
  */
  const handleDeleteSelected = () => {
    const ids = users
      .filter((u) => selected.includes(u.alias) && u.userid !== 1)
      .map((u) => u.userid);
    setSelected([]);
    const requestMsg: CliRequestMsg = {
      event: 'user-delete',
      source: 'Users View',
      message: 'User View wants to delete users',
      data: {
        ids,
      },
    };
    request(requestMsg, handleUsersReceived);
  };

  /*
    The table supports paging of the users
  */
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setRowsPerPage(parseInt(e.target.value, 10));
  };

  /**
   * Applies a filter to the users if text is entered in the search bar
   * @param {object} e The event triggered when text is entered
   */
  const handleFilterByName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(e.target.value);
  };

  /**
    Applies sorting and filtering on the users array depending on the current search / filter input.
    TODO: find a way to choose a different field then alias.
    dataFiltered is the resulting Array with the sorted and filterec users
  */
  const dataFiltered: User[] = applyUserFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">{t('Users')}</Typography>
        <CreateUser
          openCreate={openCreate}
          onOpenCreate={handleOpenCreate}
          onCloseCreate={handleCloseCreate}
          handleUsersReceived={handleUsersReceived}
        />
      </Stack>

      <Card>
        <UserTableToolbar
          selected={selected}
          filterName={filterName}
          onFilterName={handleFilterByName}
          placeholder={t('_searchuser_')}
          handleDeleteSelected={handleDeleteSelected}
          showReallyDelete={showReallyDelete}
          handleShowReallyDelete={handleShowReallyDelete}
        />

        <TableContainer>
          <Table sx={{ minWidth: 800 }} size="small">
            <UserTableHead
              order={order}
              orderBy={orderBy}
              rowCount={rowCount}
              numSelected={selected.length}
              handleTableSort={handleTableSort}
              handleSelectAllClick={handleSelectAllClick}
            />
            <TableBody data-testid="user_table_body">
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: User) => (
                  <UserTableRow
                    key={row.userid}
                    appUser={user}
                    row={row}
                    selected={selected.indexOf(row.alias) !== -1}
                    handleClick={() => handleClick(row.alias)}
                    handleDeleteUser={() => handleDeleteUser(row.userid)}
                    handleUpdateUser={handleUpdateUser}
                    devices={devices}
                  />
                ))}

              <TableEmptyRows height={77} emptyRows={emptyRows(page, rowsPerPage, users.length)} />

              {notFound && <TableNoData query={filterName} />}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          page={page}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t('_rowsperpage_')}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} ${t('of')} ${count !== -1 ? count : `${t('_morethan_')} ${to}`}`
          }
        />
      </Card>
    </Container>
  );
}
