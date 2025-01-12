/*
Author: André Kreienbring  
Renders the login, profile and create form.
  Depending on the passed in type property.
*/
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useRef, useState, useEffect } from 'react';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';

import { validateEmail } from 'src/utils/general';

import { useShelly } from 'src/sccontext';

import Iconify from 'src/components/iconify';

/*
  Separates the form components from the UserForm that communicates with the websocket.
  @param {string} type Must be 'login', 'profile', 'security' , or 'create'
  @param {object} requestResult Information about a request result from the websocket server.
  @param {array} roles A list of roles requested from the websocket server.
  @param {object} Either the currently logged in user OR a user from the UserView / UserTableRow list.
  @param {function} setRequestResult is called when a displayed request result is changed (hidden)
  @param {function} setCurrentUser called everytime an input is changed to reflect the updated user.
  @param {function} handleForgotten called when a password must be reset.
  @param {function} handleSubmit called when the form is submitted by the user.
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
}) => {
  const { user } = useShelly();
  const [homeSelection, setHomeSelection] = useState(
    type !== 'profile' ? 'dashboard' : currentUser.home
  );
  const [roleSelection, setRoleSelection] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();
  const isRolesLoaded = useRef(false);

  // the origUser is used to check if properties are changed. See checkSubmitCriterias
  const origUser = useRef(currentUser);

  /*
    Needed to ensure the form rerenders, when the roles from the server arrive.
  */
  useEffect(() => {
    if (!isRolesLoaded.current && roles.length > 0) {
      setRoleSelection(currentUser.roleid);
      isRolesLoaded.current = true;
    }
  }, [roles, requestResult, currentUser]);

  /*
    type 'login': When email or password get the focus an 'invalid credentials' warning
    will be hidden.
    type 'profile' and 'create': Empty an evtl. existing success or fail message. 
  */
  const handleInputFocus = () => {
    setRequestResult({ success: true, message: '' });
  };

  /*
    All controlled inputs constantly keep the 'currentUser'
    up to date. This way it can be directly submitted to 
    the server without collecting the form entries.
    The name of the input must match a user attribute!
    @param {object} target The input field that was changed
  */
  const handleInputChange = ({ target }) => {
    const updatedUser = { ...currentUser };
    if (target.name === 'role') {
      setRoleSelection(target.value);
      updatedUser.role = roles[target.value - 1].name;
      updatedUser.roleid = target.value;
    } else if (target.name === 'home') {
      setHomeSelection(target.value);
    } else if (target.name === 'alias') {
      // no spaces on alias
      updatedUser[target.name] = target.value.trim();
    } else {
      updatedUser[target.name] = target.value;
    }

    setCurrentUser(updatedUser);
  };

  /*
    Update the origUser to handle changes correctly and
    send the updated user to the websocket server
  */
  const handleSubmit = (e) => {
    e.preventDefault();
    origUser.current = currentUser;
    handleCurrentUser(currentUser);
  };

  /*
    If entered values are unvalid the submit button is disabled.
    This depends on the type of the form.
    @return {boolean} true if the button must be disabled.
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
        (currentUser.alias === origUser.current.alias || currentUser.alias.length === 0) &&
        currentUser.firstname === origUser.current.firstname &&
        currentUser.lastname === origUser.current.lastname &&
        currentUser.home === origUser.current.home;
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
        currentUser.password.length2 === 0;
    }
    return isDisabled;
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth size="subtitle2">
        <Stack spacing={3} sx={{ px: 3, py: 3 }}>
          {(type === 'login' || type === 'create' || type === 'security') && (
            <TextField
              required
              value={currentUser.email}
              name="email"
              label={t('Email')}
              onFocus={handleInputFocus}
              onChange={handleInputChange}
            />
          )}
          {(type === 'login' || type === 'security') && (
            <TextField
              name="password"
              required
              label={t('Password')}
              onFocus={handleInputFocus}
              onChange={handleInputChange}
              type={showPassword ? 'text' : 'password'}
              slotProps={{
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
          {type === 'security' && (
            <TextField
              required
              name="password2"
              label={t('Password')}
              onFocus={handleInputFocus}
              onChange={handleInputChange}
              type={showPassword ? 'text' : 'password'}
              slotProps={{
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
              />
              <TextField
                value={currentUser.firstname ? currentUser.firstname : ''}
                name="firstname"
                label={t('Firstname')}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
              <TextField
                value={currentUser.lastname ? currentUser.lastname : ''}
                name="lastname"
                label={t('Lastname')}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
              <TextField
                disabled={user.id === currentUser.id || currentUser.id === 1}
                required
                select
                value={roleSelection}
                name="role"
                label={t('Role')}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              >
                {typeof roles !== 'undefined'
                  ? roles.map((role) => (
                      <MenuItem key={role.name} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))
                  : null}
              </TextField>
            </Stack>
          )}
          {(type === 'settings' || type === 'create') && (
            <TextField
              required
              select
              value={homeSelection || 'dashboard'}
              name="home"
              label={t('Home')}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            >
              <MenuItem value="dashboard">Dashboard</MenuItem>
              <MenuItem value="shellies">Shellies</MenuItem>
            </TextField>
          )}
          <Stack direction="row" alignItems="baseline" justifyContent="space-between" spacing={1}>
            <Typography variant="subtitle2" color={requestResult.success ? 'success' : 'error'}>
              {t(requestResult.message)}
            </Typography>
            {type === 'login' && (
              <Link
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
            <LoadingButton
              disabled={checkSubmitCriterias()}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
            >
              {t('Login')}
            </LoadingButton>
          ) : (
            <Button
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

UserFormDisplay.propTypes = {
  type: PropTypes.string,
  currentUser: PropTypes.object,
  setCurrentUser: PropTypes.func,
  requestResult: PropTypes.object,
  setRequestResult: PropTypes.func,
  roles: PropTypes.array,
  handleForgotten: PropTypes.func,
  handleCurrentUser: PropTypes.func,
};
