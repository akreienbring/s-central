/*
  Author: André Kreienbring
  A table that all devices or those assigned to a user.
  It allows sorting and selecting devices for batch operations.
 */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';

import { emptyRows, getComparator } from 'src/utils/sort-array';

import { useShelly } from 'src/sccontext';

import ShellyTableRow from 'src/sections/shellies/shelly-table-row';
import ShellyTableToolbar from 'src/sections/shellies/shelly-table-toolbar';

const headCells = [
  {
    id: 'image',
    disablePadding: true,
    label: '',
  },
  {
    id: 'name',
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'model',
    disablePadding: false,
    label: 'Model',
  },
  {
    id: 'gen',
    disablePadding: false,
    label: 'Gen',
  },
  {
    id: 'uptime',
    disablePadding: false,
    label: 'Uptime',
  },
  {
    id: 'restart',
    disablePadding: false,
    label: 'Reboot',
  },
  {
    id: 'firmware',
    disablePadding: false,
    label: 'Firmware',
  },
  {
    id: 'stable',
    disablePadding: false,
    label: 'Stable',
  },
  {
    id: 'beta',
    disablePadding: false,
    label: 'Beta',
  },
  {
    id: 'menue',
    disablePadding: true,
    label: '',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const { t } = useTranslation();

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              hideSortIcon
            >
              {t(headCell.label)}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

/**
  The main table component that shows all devices.
  It allows sorting and selecting devices for batch operations.
  @param {array} devices The devices to show in the table 
 */
export default function ShellyTable({ devices }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { send } = useShelly();
  const [rows, setRows] = useState([]);
  const [alert, setAlert] = useState({ title: '', text: '', severity: '', visible: false });
  const { t } = useTranslation();

  useEffect(() => {
    setRows(
      devices.map((device) => {
        const sys = device?.wsmessages?.NotifyFullStatus?.params?.sys;
        return {
          id: device.id,
          image: device.image,
          name: device.cname.substring(0, 14),
          model: device.name,
          gen: device.gen,
          uptime: sys?.uptime,
          restart: device.rebootPending ? 'reboot pending' : sys?.restart_required,
          firmware: device.fw_id,
          stable: device.updateStablePending ? 'stable pending' : device.stable,
          beta: device.updateBetaPending ? 'beta pending' : device.beta,
        };
      })
    );
  }, [devices]);

  /** 
   Called from within a TableRow. Updates a row in the rows array.
    @param {object} update The updated row object
   */
  const updateRow = (update) => {
    rows[rows.findIndex((row) => row.id === update.id)] = update;
    setRows(rows);
  };

  /**
    Called from within the table row popover or the toolbar, when devices
    must be updated to the stable or beta firmware.
    Checks if a stable version is available.
    @param {string} type Must be "stable" or "beta"
    @param {array} [ids] The ids of the devices that must be updated
  */
  const handleFirmwareUpdates = (type, ids) => {
    if (typeof ids === 'undefined') ids = selected;

    const checkedIds = ids.filter((id) => {
      const row = rows.find((r) => r.id === id);
      return type === 'stable'
        ? typeof row.stable !== 'undefined'
        : typeof row.beta !== 'undefined';
    });

    if (checkedIds.length > 0) {
      send({
        event: `devices ${type} update`,
        data: {
          source: 'Shelly Table',
          message: 'Shelly Table wants to update the firmware of devices',
          ids: checkedIds,
        },
      });
    }

    if (checkedIds.length !== ids.length) {
      setAlert({
        title: '',
        text:
          checkedIds.length === 0
            ? t('_noupdateavailable_', { type })
            : t('_updateavailable_', {
                checked: checkedIds.length,
                selected: ids.length,
                type,
              }),
        severity: 'warning',
        visible: true,
      });
    }
  };

  /**
    Called from within the table row popover or the toolbar, when devices
    must be rebooted.
    @param {array} [ids] The ids of the devices that must be rebooted
  */
  const handleRebootDevices = (ids) => {
    if (typeof ids === 'undefined') ids = selected;
    send({
      event: 'devices reboot',
      data: {
        source: 'Shelly Table',
        message: 'Shelly Table wants to reboot devices',
        ids,
      },
    });
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyrows = emptyRows(page, rowsPerPage, rows.length);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <ShellyTableToolbar
          selected={selected}
          handleRebootDevices={handleRebootDevices}
          handleFirmwareUpdates={handleFirmwareUpdates}
          alert={alert}
          setAlert={setAlert}
        />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {rows
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = selected.includes(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <ShellyTableRow
                      key={row.id}
                      row={row}
                      labelId={labelId}
                      isItemSelected={isItemSelected}
                      handleClick={handleClick}
                      handleRebootDevices={handleRebootDevices}
                      handleFirmwareUpdates={handleFirmwareUpdates}
                      updateRow={updateRow}
                    />
                  );
                })}
              {emptyrows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyrows,
                  }}
                >
                  <TableCell colSpan={10} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
