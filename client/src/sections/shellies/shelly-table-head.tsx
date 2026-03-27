import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';

import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';

interface EnhancedTableHeadProps {
  handleSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: SortOrder;
  orderBy: string;
  numSelected: number;
  rowCount: number;
  handleTableSort: (property: string) => void;
}

export default function ShellyTableHead({
  handleSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  handleTableSort,
}: EnhancedTableHeadProps): JSX.Element {
  const { t } = useTranslation();

  const onSort = (property: string) => () => {
    handleTableSort(property);
  };

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

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={handleSelectAllClick}
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
              onClick={onSort(headCell.id)}
              hideSortIcon
            >
              {t(headCell.label)}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
