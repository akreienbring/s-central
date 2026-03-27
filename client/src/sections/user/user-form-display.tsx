/*
  Author: André Kreienbring  
  Renders the User login, profile, security, settings and create form depending on the passed in type property.
  Hirarchy:
    LoginView
    |_UserForm
      |_UserFormDisplay

    UserTableRow or AccountPopover
    |_UpdateUser
      |_UserForm
        |_UserFormDisplay

    UserView
    |_CreateUser
      |_UserForm
        |_UserFormDisplay
*/
import type { User, UserHome, UserFormType } from '@src/types/user';

import { type JSX, useState } from 'react';
import Iconify from '@src/components/iconify';
import { useTranslation } from 'react-i18next';
import { useShelly } from '@src/hooks/use-shelly';
import { validateEmail } from '@src/utils/general';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

interface UserFormDisplayProps {
  type: UserFormType;
  requestResult: { success: boolean; message: string };
  roles: Array<{ id: number; name: string }>;
  currentUser: User;
  setRequestResult: (result: { success: boolean; message: string }) => void;
  setCurrentUser: (user: User) => void;
  handleForgotten: (email: string) => void;
  handleCurrentUser: (user: User) => void;
}

/**
  Separates the form display components from the UserForm that communicates with the websocket.
  @param {UserFormType} type Must be 'login', 'profile', 'security' , 'create' or 'settings'
  @param {object} requestResult Information about a request result from the websocket server.
  @param {array} roles A list of roles requested from the websocket server.
  @param {object} currentUser Either the currently logged in user OR a user from the UserView / UserTableRow list.
  @param {function} setRequestResult is called when a displayed request result is changed (hidden)
  @param {function} setCurrentUser called everytime an input is changed to reflect the updated user.
  @param {function} handleForgotten called when a password must be reset.
  @param {function} handleCurrentUser called when the user was changed.
  @returns {JSX.Element}
*/
const UserFormDisplay = ({
  type,
  requestResult,
  roles,
  currentUser,
  setRequestResult,
  setCurrentUser,
  handleForgotten,
  handleCurrentUser,
}: UserFormDisplayProps): JSX.Element => {
  /*
    user is the currently logged in user.
    currentUser is the user that is being edited.
    origUser is used to check if properties are changed. See checkSubmitCriterias
  */
  const { user } = useShelly();
  const [origUser, setOrigUser] = useState({ ...currentUser });

  const [homeSelection, setHomeSelection] = useState<UserHome>(
    type === 'create' ? 'dashboard' : currentUser.home
  );
  const [roleSelection, setRoleSelection] = useState(type === 'create' ? 3 : currentUser.roleid);
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  /*
    type 'login': When email or password get the focus an 'invalid credentials' warning
    will be hidden.
    type 'profile' and 'create': Empty an evtl. existing success or fail message. 
  */
  const handleInputFocus = () => {
    setRequestResult({ success: true, message: '' });
  };

  /**
    All controlled inputs constantly keep the 'currentUser'
    up to date. This way it can be directly submitted to 
    the server without collecting the form entries.
    The name of the input must match a user attribute!
    @param {object} event (with target) The input field that was changed
  */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedUser = { ...currentUser };
    const target = event.target;

    if (target.name === 'role') {
      const roleid = Number(target.value);
      updatedUser.role = roles[roleid - 1].name as User['role'];
      updatedUser.roleid = roleid;
      setRoleSelection(roleid);
    } else if (target.name === 'home') {
      setHomeSelection(target.value as UserHome);
      updatedUser.home = target.value as UserHome;
    } else if (target.name === 'istest') {
      // login test checkbox used by cypress
      updatedUser.istest = target.checked;
    } else {
      // no spaces on these fields
      if (target.name === 'alias') updatedUser[target.name] = target.value.trim();
      if (target.name === 'firstname') updatedUser[target.name] = target.value.trim();
      if (target.name === 'lastname') updatedUser[target.name] = target.value.trim();
      if (target.name === 'password') updatedUser[target.name] = target.value.trim();
      if (target.name === 'password2') updatedUser[target.name] = target.value.trim();
      if (target.name === 'email') updatedUser[target.name] = target.value.trim();
    }

    setCurrentUser(updatedUser);
  };

  /**
    Update the origUser to handle changes correctly and
    send the updated user to the websocket server
    @param {object} e The event
  */
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOrigUser(currentUser);
    handleCurrentUser(currentUser);
  };

  /**
    If entered values are unvalid the submit button is disabled.
    This depends on the type of the form.
    @return {boolean} true if the submit button must be disabled.
  */
  const checkSubmitCriterias = () => {
    if (currentUser === null) return true;
    let isDisabled = false;
    if (type === 'login') {
      // disable if email or password is empty or email not valid
      isDisabled =
        typeof currentUser.email === 'undefined' ||
        currentUser.email.length === 0 ||
        typeof currentUser.password === 'undefined' ||
        currentUser.password.length === 0 ||
        !validateEmail(currentUser.email);
    }
    if (type === 'profile' || type === 'settings') {
      // disable if nothing was changed or alias is empty
      isDisabled =
        (currentUser.alias === origUser.alias || currentUser.alias.length === 0) &&
        currentUser.roleid === origUser.roleid &&
        currentUser.firstname === origUser.firstname &&
        currentUser.lastname === origUser.lastname &&
        currentUser.home === origUser.home;
    }
    if (type === 'create') {
      // disable if email or alias is empty or email not valid
      isDisabled =
        typeof currentUser.email === 'undefined' ||
        currentUser.email.length === 0 ||
        !validateEmail(currentUser.email) ||
        typeof currentUser.alias === 'undefined' ||
        currentUser.alias.length === 0;
    }
    if (type === 'security') {
      // disable if email is empty or not valid of if password are not equal
      isDisabled =
        !validateEmail(currentUser.email) ||
        currentUser.password !== currentUser.password2 ||
        typeof currentUser.password === 'undefined' ||
        currentUser.password.length === 0 ||
        typeof currentUser.password2 === 'undefined' ||
        currentUser.password2.length === 0;
    }
    return isDisabled;
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth>
        <Stack spacing={3} sx={{ px: 3, py: 3 }}>
          {(type === 'login' || type === 'create' || type === 'security') && (
            <TextField
              slotProps={{ htmlInput: { 'data-testid': 'security_email_input', maxLength: 20 } }}
              required
              value={currentUser.email}
              name="email"
              label={t('Email')}
              onFocus={handleInputFocus}
              onChange={handleInputChange}
            />
          )}
          {(type === 'login' || type === 'security') && (
            <>
              <TextField
                name="password"
                required
                label={t('Password')}
                onFocus={handleInputFocus}
                onChange={handleInputChange}
                type={showPassword ? 'text' : 'password'}
                slotProps={{
                  htmlInput: { 'data-testid': 'security_password_input', maxLength: 15 },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              {type === 'login' && (
                <FormControlLabel
                  data-testid="login_test_checkbox"
                  control={
                    <Checkbox
                      name="istest"
                      checked={currentUser.istest}
                      onChange={handleInputChange}
                    />
                  }
                  label="Test"
                  sx={{ display: 'none' }}
                />
              )}
            </>
          )}
          {type === 'security' && (
            <TextField
              required
              name="password2"
              label={t('Password')}
              onFocus={handleInputFocus}
              onChange={handleInputChange}
              type={showPassword ? 'text' : 'password'}
              slotProps={{
                htmlInput: { 'data-testid': 'security_password2_input', maxLength: 15 },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
          {(type === 'profile' || type === 'create') && (
            <Stack spacing={3}>
              <TextField
                required
                value={currentUser.alias}
                name="alias"
                label={t('Alias')}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                slotProps={{
                  htmlInput: { 'data-testid': 'profile_alias_input', maxLength: 10 },
                }}
              />
              <TextField
                value={currentUser.firstname ? currentUser.firstname : ''}
                name="firstname"
                label={t('Firstname')}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                slotProps={{
                  htmlInput: { 'data-testid': 'profile_firstname_input', maxLength: 20 },
                }}
              />
              <TextField
                value={currentUser.lastname ? currentUser.lastname : ''}
                name="lastname"
                label={t('Lastname')}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                slotProps={{
                  htmlInput: { 'data-testid': 'profile_lastname_input', maxLength: 20 },
                }}
              />
              {roles.length > 0 && (
                <TextField
                  disabled={user!.userid === currentUser.userid || currentUser.userid === 1}
                  required
                  select
                  value={roleSelection}
                  name="role"
                  label={t('Role')}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  slotProps={{
                    htmlInput: { 'data-testid': 'profile_role_select' },
                  }}
                >
                  {typeof roles !== 'undefined'
                    ? roles.map((role) => (
                        <MenuItem key={role.name} value={role.id}>
                          {role.name}
                        </MenuItem>
                      ))
                    : null}
                </TextField>
              )}
            </Stack>
          )}
          {(type === 'settings' || type === 'create') && (
            <TextField
              required
              select
              value={homeSelection || 'Dashboard'}
              name="home"
              label={t('Home')}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              slotProps={{
                htmlInput: { 'data-testid': 'settings_home_select' },
              }}
            >
              <MenuItem data-testid="home_dashboard_option" value="dashboard">
                Dashboard
              </MenuItem>
              <MenuItem data-testid="home_shellies_option" value="shellies">
                Shellies
              </MenuItem>
            </TextField>
          )}
          <Stack direction="row" alignItems="baseline" justifyContent="space-between" spacing={1}>
            <Typography variant="subtitle2" color={requestResult.success ? 'success' : 'error'}>
              {t(requestResult.message)}
            </Typography>
            {type === 'login' && (
              <Link
                data-testid="user_resetpw_link"
                variant="subtitle2"
                underline="hover"
                color="primary"
                style={{ cursor: 'pointer' }}
                onClick={() => handleForgotten(currentUser.email)}
              >
                {t('_forgotpw_')}
              </Link>
            )}
          </Stack>
          {type === 'login' ? (
            <Button
              data-testid="login_submit_button"
              disabled={checkSubmitCriterias()}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
            >
              {t('Login')}
            </Button>
          ) : (
            <Button
              data-testid="account_save_button"
              disabled={checkSubmitCriterias()}
              fullWidth
              size="large"
              type="submit"
              color="inherit"
              variant="outlined"
              startIcon={<Iconify icon="formkit:submit" />}
            >
              {t('Save')}
            </Button>
          )}
        </Stack>
      </FormControl>
    </form>
  );
};

export default UserFormDisplay;
