/*
  Author: André Kreienbring
  Main View for the user management
*/
import { useTranslation } from 'react-i18next';
import { useRef, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { mapNumberToMax } from 'src/utils/general';

import { useShelly } from 'src/sccontext';
// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-imports
import { subscribeEvent, unsubscribeEvent } from 'src/events/pubsub';

import Scrollbar from 'src/components/scrollbar';

import CreateUser from '../create-user';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function UserView() {
  const [page, setPage] = useState(0);
  const [users, setUsers] = useState([]);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { t } = useTranslation();
  const { request } = useShelly();
  const [openCreate, setOpenCreate] = useState(false);
  const isUsersLoaded = useRef(false);
  const [showReallyDelete, setShowReallyDelete] = useState(false);

  /**
    The received users will be mapped to the table values.
    Called when users arrive due to a request send to the websocket server.
    Also called when a user was deleted and the server sends an updated list.
    Also passed to the CreateUser Component and called when a user was created.
    @param {object} msg A ws message that contains the users sent by the servers
  */
  const handleUsersReceived = (msg) => {
    const serverUsers = msg.data.users;
    const clientUsers = serverUsers.map((serverUser, index) => ({
      id: serverUser.userid,
      avatarUrl: `/assets/images/avatars/avatar_${mapNumberToMax(serverUser.userid, 25)}.jpg`,
      alias: serverUser.alias,
      firstname: serverUser.firstname,
      lastname: serverUser.lastname,
      role: serverUser.rolename,
      email: serverUser.email,
      home: serverUser.home,
      roleid: serverUser.roleid,
    }));
    isUsersLoaded.current = true;
    setUsers(clientUsers);
  };

  /**
    Called when a user was updated. Updates the
    list of users.
    @param {object} updateuser The user that was updated
  */
  const handleUpdateUser = useCallback(
    (updateuser) => {
      const updatedUsers = [...users];
      const index = updatedUsers.findIndex((x) => x.id === updateuser.id);
      updatedUsers[index] = updateuser;
      updatedUsers[index].avatarUrl =
        `/assets/images/avatars/avatar_${mapNumberToMax(updateuser.id, 25)}.jpg`;

      setUsers(updatedUsers);
    },
    [users]
  );

  /*
    If a user is updated from the Accout popover, then an
    event signals that this view must update the list of users.
  */
  const handleUpdateUserEvent = useCallback(
    (e) => {
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
    subscribeEvent('userUpdated', handleUpdateUserEvent);
    if (!isUsersLoaded.current)
      request(
        {
          event: 'users get all',
          data: {
            name: 'Users View',
            message: 'User View needs the list of users',
          },
        },
        handleUsersReceived
      );
    /*
    return () => {
      // cleanup on unmount: unsubscribe from the event
      unsubscribeEvent('userUpdated');
    };
    */
  }, [request, handleUpdateUserEvent]);
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
  const handleShowReallyDelete = (show) => {
    setShowReallyDelete(show);
  };

  /**
   * Sorts the table by a certain user property
   * @param {object} e The event 
   * @param {string} id The user property to sort the table (e.g. name)
   */
  const handleSort = (e, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  /*
    Add all users except the Admin to the selection. 
  */
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.filter((u) => u.id !== 1).map((u) => u.alias);
      setSelected(newSelecteds);
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
  const handleClick = (e, alias) => {
    const selectedIndex = selected.indexOf(alias);
    let newSelected = [];
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
    @param {number} id The id of the user that must be deleted
  */
  const handleDeleteUser = (id) => {
    request(
      {
        event: 'user delete',
        source: {
          name: 'Users View',
          message: 'User View wants to delete a user',
          ids: [id],
        },
      },
      handleUsersReceived
    );
  };

  /**
    Delete all selected users. The Admin is excluded!
  */
  const handleDeleteSelected = () => {
    const ids = users
      .filter((user) => selected.includes(user.alias) && user.id !== 1)
      .map((user) => user.id);
    setSelected([]);
    request(
      {
        event: 'user delete',
        data: {
          source: 'Users View',
          message: 'User View wants to delete users',
          ids,
        },
      },
      handleUsersReceived
    );
  };

  /*
    The table supports paging of the users
  */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  /**
   * Applies a filter to the users if text is entered in the search bar
   * @param {object} e The event triggered when text is entered
   */
  const handleFilterByName = (e) => {
    setPage(0);
    setFilterName(e.target.value);
  };

  /**
    Applies a filter on the users array depending on the current search / filter input.
    TODO: find a way to choose a different field.
  */
  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
    field: 'alias',
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
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

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'alias', label: t('Alias') },
                  { id: 'firstname', label: t('Firstname') },
                  { id: 'lastname', label: t('Lastname') }, // , align: 'center' },
                  { id: 'role', label: t('Role') },
                  { id: 'email', label: t('Email') },
                  { id: 'home', label: t('Home') },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      id={row.id}
                      alias={row.alias}
                      firstname={row.firstname}
                      lastname={row.lastname}
                      role={row.role}
                      email={row.email}
                      home={row.home}
                      roleid={row.roleid}
                      avatarUrl={row.avatarUrl}
                      selected={selected.indexOf(row.alias) !== -1}
                      handleClick={(event) => handleClick(event, row.alias)}
                      handleDeleteUser={(event) => handleDeleteUser(row.id)}
                      handleUpdateUser={handleUpdateUser}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

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
