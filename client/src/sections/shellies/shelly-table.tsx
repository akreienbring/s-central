/*
  Author: André Kreienbring
  A table that all devices or those assigned to a user.
  It allows sorting and selecting devices for batch operations.
 */
import type { Device, BatchAlert, DeviceTableRow } from '@src/types/device';

import { type JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useShelly } from '@src/hooks/use-shelly';
import { emptyRows, getComparator } from '@src/utils/sort-array';
import ShellyTableRow from '@src/sections/shellies/shelly-table-row';
import ShellyTableHead from '@src/sections/shellies/shelly-table-head';
import ShellyTableToolbar from '@src/sections/shellies/shelly-table-toolbar';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { applyDeviceTableSort } from './shelly-sort-utils';

/**
  The main table component that shows all devices.
  It allows sorting and selecting devices for batch operations.
  @param {array} devices The devices to show in the table
  @returns {JSX.Element} The components with the table of devices. 
 */
export default function ShellyTable({ devices }: { devices: Device[] }): JSX.Element {
  const [order, setOrder] = useState<SortOrder>('asc');
  const [orderBy, setOrderBy] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const { send } = useShelly();
  const [rows, setRows] = useState<DeviceTableRow[]>(
    devices.map((device: Device) => {
      const sys = device?.notifyFullStatus?.params?.sys;
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
        reloads: device.reloads,
      } as DeviceTableRow;
    })
  );
  const [alert, setAlert] = useState<BatchAlert>({
    title: '',
    text: '',
    severity: 'info',
    visible: false,
  });
  const { t } = useTranslation();

  /** 
   Called from within a TableRow. Updates a row in the rows array.
    @param {DeviceTableRow} update The updated row object
   */
  const handleUpdateRow = (update: DeviceTableRow) => {
    const newRows = [...rows];
    newRows[newRows.findIndex((row) => row.id === update.id)] = update;
    setRows(newRows);
  };

  /**
    Called from within the table row popover or the toolbar, when devices
    must be updated to the stable or beta firmware.
    Checks if a stable / beta version is available.
    @param {string} type Must be "stable" or "beta"
    @param {array} [ids] The ids of the devices that must be updated
  */
  const handleFirmwareUpdates = (type: 'stable' | 'beta', ids?: string[]) => {
    if (typeof ids === 'undefined') ids = selected;

    const checkedIds = ids.filter((id) => {
      const row: DeviceTableRow | undefined = rows.find((r) => r.id === id);
      return type === 'stable'
        ? typeof row?.stable !== 'undefined'
        : typeof row?.beta !== 'undefined';
    });

    if (checkedIds.length > 0) {
      const requestMsg: CliRequestMsg = {
        event: `devices-${type}-update`,
        source: 'Shelly Table',
        message: 'Shelly Table wants to update the firmware of devices',
        data: {
          ids: checkedIds,
        },
      };
      send(requestMsg);
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
    @param {string[]} [ids] The ids of the devices that must be rebooted
  */
  const handleRebootDevices = (ids?: string[]) => {
    if (typeof ids === 'undefined') ids = selected;
    const requestMsg: CliRequestMsg = {
      event: 'devices-reboot',
      source: 'Shelly Table',
      message: 'Shelly Table wants to reboot devices',
      data: {
        ids,
      },
    };
    send(requestMsg);
  };

  const handleTableSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

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

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyrows = emptyRows(page, rowsPerPage, rows.length);

  /**
    Sorts the rows of the device table.
    dataFiltered is the resulting Array with the sorted rows
  */
  const dataFiltered: DeviceTableRow[] = applyDeviceTableSort({
    inputData: rows,
    comparator: getComparator(order, orderBy),
  });

  return (
    <Card>
      <ShellyTableToolbar
        selected={selected}
        handleRebootDevices={handleRebootDevices}
        handleFirmwareUpdates={handleFirmwareUpdates}
        alert={alert}
        setAlert={setAlert}
      />
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
          <ShellyTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            handleSelectAllClick={handleSelectAllClick}
            handleTableSort={handleTableSort}
            rowCount={rows.length}
          />
          <TableBody>
            {dataFiltered
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
                    handleUpdateRow={handleUpdateRow}
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
    </Card>
  );
}
