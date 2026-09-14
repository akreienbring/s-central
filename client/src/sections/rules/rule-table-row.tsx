/*
  Author: André Kreienbring
  Presents a single row in the rulee table with a menu for editing and deleting the rule.
*/
import type { SCentralRule } from '@src/types/rule';

import { type JSX, useState } from 'react';
import Iconify from '@src/components/iconify';
import { useTranslation } from 'react-i18next';
import { createUUID } from '@src/utils/general';
import { fDate, fDateTime } from '@src/utils/format-time';
import ScriptSwitch from '@src/components/custom/script-switch';

import {
  Menu,
  TableRow,
  Checkbox,
  MenuItem,
  TableCell,
  Typography,
  IconButton,
  ListItemIcon,
} from '@mui/material';

interface RuleTableRowProps {
  rule: SCentralRule;
  schemaName: string;
  selected: boolean;
  handleClick: () => void;
  handleDeleteRule: (ruleid: number) => void;
  handleOpenRule: (rule: SCentralRule) => void;
  handleToggleRule: (ruleid: number) => void;
}

/**
  Presents a single row in the user table
  @param {RuleTableRowProps} props
  @param {SCentralRule} props.rule with the values of the current row
 * @param {string} props.schemaName - The name of the schema of the rule
  @param {boolean} props.selected true if the row is selected
  @param {Function} props.handleClick Called when clicking the checkbox of a rule entry
  @param {Function} props.handleDeleteRule Called when a rule must be deleted
  @param {Function} props.handleOpenRule Called when a rule must be opened
  @param {Function} props.handleTestRule Called when a rule must be tested
  @param {Function} props.handleToggleRule Called when a rule must be enabled / disabled on the server
  @returns {JSX.Element}
*/
export default function UserTableRow({
  rule,
  schemaName,
  selected,
  handleClick,
  handleDeleteRule,
  handleOpenRule,
  handleToggleRule,
}: RuleTableRowProps): JSX.Element {
  const [openMenue, setOpenMenue] = useState<HTMLButtonElement | null>(null);
  const [showReallyDelete, setShowReallyDelete] = useState(false);
  const { t } = useTranslation();

  /**
    Open the create rule dialog.
  */
  const handleOpenUpdate = () => {
    handleCloseMenu();
    handleOpenRule(rule);
  };

  /**
    Open the Menue of the user tabel row
    @param {object} e is the click event
  */
  const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpenMenue(e.currentTarget);
    setShowReallyDelete(false);
  };
  /**
    Close the Menue of the rule table row
  */
  const handleCloseMenu = () => {
    setOpenMenue(null);
  };

  /**
    Add Really Delete to the Menue
  */
  const handleShowReally = () => {
    setShowReallyDelete(true);
  };

  /**
   * Called when the user 'really' wants to delete a rule
   * @param {number} ruleid - The id of the rule that must be deleted
   */
  const handleDeleteReally = (ruleid: number) => {
    setOpenMenue(null);
    handleDeleteRule(ruleid);
  };

  return (
    <>
      <TableRow
        data-testid="rule_tablerow_component"
        hover
        tabIndex={-1}
        role="checkbox"
        selected={selected}
      >
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>
        <TableCell>
          <ScriptSwitch
            key={createUUID()}
            size="small"
            checked={rule.isEnabled}
            color={rule.isEnabled ? 'success' : 'warning'}
            onChange={() => handleToggleRule(rule.ruleid)}
          />
        </TableCell>
        <TableCell>
          <Typography>{rule.ruleid}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{rule.name}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{rule.description}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{schemaName}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{fDate(rule.createdAt, 'dd MMM yy')}</Typography>
        </TableCell>
        <TableCell>
          <Typography>
            {rule.triggeredAt !== null && typeof rule.triggeredAt !== 'undefined'
              ? fDateTime(rule.triggeredAt, 'dd MMM HH:mm')
              : '--'}
          </Typography>
        </TableCell>

        <TableCell align="right">
          <IconButton data-testid="rule_menu_button" onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Menu
        open={!!openMenue}
        anchorEl={openMenue}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { width: 170, maxWidth: '100%' },
          },
        }}
      >
        <MenuItem key={`Edit_${rule.ruleid}`} onClick={() => handleOpenUpdate()}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          </ListItemIcon>
          {t('Edit')}
        </MenuItem>

        <MenuItem
          data-testid="rule_delete_button"
          key={`Delete${rule.ruleid}`}
          onClick={handleShowReally}
          sx={{ color: 'warning.main' }}
        >
          <ListItemIcon>
            <Iconify icon="eva:trash-2-fill" color="warning" />
          </ListItemIcon>
          {t('Delete')}
        </MenuItem>

        {showReallyDelete && (
          <MenuItem
            data-testid="rule_really_delete_button"
            key={`Really${rule.ruleid}`}
            onClick={() => handleDeleteReally(rule.ruleid)}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <Iconify icon="material-symbols:help-rounded" color="error" />
            </ListItemIcon>
            {t('_reallydelete_')}
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
