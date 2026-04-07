/*
  Author: André Kreienbring
  The User Table Head component defines the table headers for the user table, including sorting and selection functionalities.
  It is part of the UserView component.
*/
import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';

interface UserTableHeadProps {
  order: SortOrder;
  orderBy: string;
  rowCount: number;
  numSelected: number;
  handleTableSort: (property: string) => void;
  handleSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * User Table Head that is used in the UserView component
 * @param {UserTableHeadProps} props
 * @param {string} props.order The order of the sorted table (asc or desc)
 * @param {string} props.orderBy The column to order by (e.g. 'name', 'email'...)
 * @param {number} props.rowCount The number of rows in the table
 * @param {number} props.numSelected The number of selected rows
 * @param {Function} props.handleTableSort The function to call when a sort is requested
 * @param {Function} props.handleSelectAllClick The function to call when the select all checkbox is clicked
 * @returns {JSX.Element}
 */
export default function UserTableHead({
  order,
  orderBy,
  rowCount,
  numSelected,
  handleTableSort,
  handleSelectAllClick,
}: UserTableHeadProps): JSX.Element {
  const { t } = useTranslation();

  /**
   * Requiered by the TableSortLabel component.
   * Called when the sort function of a table head is clicked.
   * @param {string} property The property used to sort the table
   */
  const handleSort = (property: string) => () => {
    handleTableSort(property);
  };

  const headCells = [
    { id: 'avatar', label: '' },
    { id: 'alias', label: 'Alias' },
    { id: 'firstname', label: 'Firstname' },
    { id: 'lastname', label: 'Lastname' },
    { id: 'role', label: 'Role' },
    { id: 'email', label: 'Email' },
    { id: 'home', label: 'Home' },
    { id: '', label: '' },
  ];

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={handleSelectAllClick}
          />
        </TableCell>

        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={handleSort(headCell.id)}
            >
              {t(headCell.label)}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
