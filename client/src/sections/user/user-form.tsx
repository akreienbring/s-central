/*
  Author: André Kreienbring
  Renders the login, profile, security and create form.
  Depending on the passed in type property.
  Hirarchy:
    LoginView
    |_UserForm
      |_UserFormDisplay

    UserTableRow or AccountPopover
    |_ UpdateUser
      |_UserForm
        |_UserFormDisplay

    UserView
     |_CreateUser
       |_UserForm
         |UserFormDisplay
*/
import type { User } from '@src/types/user';

import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useShelly } from '@src/hooks/use-shelly';
import { publishEvent } from '@src/events/pubsub';
import { type JSX, useState, useEffect, useCallback } from 'react';

import UserFormDisplay from './user-form-display';

interface UserFormProps {
  type: 'login' | 'profile' | 'security' | 'create' | 'settings';
  updateuser?: User;
  handleUsersReceived?: (msg: SrvAnswerMsg) => void;
  handleUpdateUser?: (user: User) => void;
}

/**
  Presents a form to create / update / validate a user. Communicates with the 
  websocket server. The 'currentUser' is set to the logged in user OR to a user
  that must be updated from the UserView / UserTableRow list.
  @param {UserFormProps} props
  @param {string} props.type Must be 'login', 'profile', 'security' , 'create' or 'settings'
  @param {User} [props.updateuser] The user that can be updated. Only set when a user
    from the list of users (UserView / UserTableRow) is updated
  @param {Function} props.handleUsersReceived Will be used to update the list of all users
    in the UserView
  @param {Function} props.handleUpdateUser When a user was updated this must be reflected in the UserView
  @returns {JSX.Element}
*/
const UserForm = ({
  type,
  updateuser,
  handleUsersReceived,
  handleUpdateUser,
}: UserFormProps): JSX.Element => {
  const { login, user, request } = useShelly();
  const { t } = useTranslation();

  const [currentUser, setCurrentUser] = useState<User>(
    updateuser
      ? updateuser
      : ({
          //coming from CreateUser or LoginView
          alias: '',
          email: '',
          firstname: '',
          lastname: '',
          password: '',
          home: 'dashboard',
          roleid: 3,
          userid: 0,
          istest: false,
        } as User)
  );
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [requestResult, setRequestResult] = useState<RequestResult>({ success: true, message: '' });
  const location = useLocation();

  /**
    ONLY when type = 'login'!  
    Called when a 'user-validate' answer was received upon a former
    request that was send by 'handleCurrentUser'
    @param {object} msg The message that was passed with the answer
  */
  const handleUserValidated = useCallback(
    (msg: SrvValidateMsg) => {
      const result = msg.data.requestResult;
      if (result && result.success && msg.data.user) {
        setCurrentUser(msg.data.user);
        login(msg.data.user, true);
      } else {
        setRequestResult({ success: false, message: '_usernotexists_' });
      }
    },
    [login]
  );

  /**
    ONLY when type = 'profile', 'settings or 'security'! 
    Called when a 'user profile update', 'user-settings-update' or 'user-security-update' message was received upon a former
    request that was send by 'handleCurrentUser'
    Presents the result of the request and 
    @param {object} msg The message that was passed with the answer from the server
  */
  const handleUserUpdated = useCallback(
    (msg: SrvAnswerMsg) => {
      const result = msg.data.requestResult;
      if (result) {
        setRequestResult({
          success: result.success,
          message: result.success ? '_userupdated_' : result.message,
        } as RequestResult);

        if (result.success) {
          const newCurrentUser: User = { ...currentUser };
          if (user && user.userid === currentUser.userid) {
            // update the context user
            if (type === 'security' || type === 'profile' || type === 'settings') {
              delete newCurrentUser.password2;
              delete newCurrentUser.password;
              login(newCurrentUser, false);
            }
          }

          if (typeof handleUpdateUser !== 'undefined') {
            handleUpdateUser(newCurrentUser);
          } else if (location.pathname === '/user') publishEvent('userUpdated', newCurrentUser);
        }
      }
    },
    [user, currentUser, login, handleUpdateUser, location, type]
  );

  /**
    ONLY when type = 'create'! 
    Called when a 'user-create' message was received upon a former
    request that was send by 'handleCurrentUser'
    @param {object} msg The mesage that was passed with the answer from the server
  */
  const handleUserCreated = useCallback(
    (msg: SrvAnswerMsg) => {
      const result = msg.data.requestResult;
      if (result) {
        setRequestResult({
          success: result.success,
          message: result.success ? '_usercreated_' : result.message,
        } as RequestResult);

        // if successful: update the users in UserView
        if (result.success && typeof handleUsersReceived !== 'undefined') handleUsersReceived(msg);
      }
    },
    [handleUsersReceived]
  );

  /**
    Called when the requested list of roles 
    is received from the server.
    @param {object} msg The received ws message with the list of roles
  */
  const handleRolesReceived = useCallback((msg: SrvAnswerMsg) => {
    if (msg.data.roles) setRoles(msg.data.roles);
  }, []);

  /**
   * Called when the password was reset
   * @param {object} msg The received ws message indicating if
   *  the reset was successful or not
   */
  const handleResetPW = useCallback(
    (msg: SrvAnswerMsg) => {
      const result = msg.data.requestResult;
      if (result) {
        setRequestResult({
          success: result.success,
          message: result.success
            ? t('_resetpw_')
            : result.message
              ? t(result.message)
              : t('_notresetpw_'),
        } as RequestResult);
      }
    },
    [t]
  );

  // --------------------- Websocket Implementation BEGIN----------------
  /*
      When the user submits the login form or wants to reset his password messages
      are send to the websocket server. The server answers and the response is
      handled accordingly.
    */
  useEffect(() => {
    if (type === 'profile' || type === 'create') {
      const requestMsg: CliRequestMsg = {
        event: 'roles-get-all',
        source: 'Users Form',
        message: 'User Form needs the list of roles',
        data: {},
      };
      request(requestMsg, handleRolesReceived);
    }
  }, [type, handleRolesReceived, request]);
  // --------------------- Websocket Implementation END------------------

  /**
    Called when the user form was submitted.
    Sends a validation request to the websocket server (type = 'login')
    OR updates the current user profile data (type = 'profile)
    OR creates the current user (type = 'create)
    OR updates the current user credentials (type = 'security)
    OR creates the current user settings (type = 'settings)
    The answer is received as a websocket message.
    @param {object} formUser The user that was submitted from the form
  */
  const handleCurrentUser = (formUser: User) => {
    if (type === 'login') {
      // send a validation request to validate the credentials
      const requestMsg: CliValidateMsg = {
        event: 'user-validate',
        source: 'User Form',
        message: 'User Form wants to validate a user',
        data: {
          user: formUser,
        },
      };
      request(requestMsg, handleUserValidated);
    } else if (type === 'profile') {
      // send the updated user to the server
      const requestMsg: CliRequestMsg = {
        event: 'user-profile-update',
        source: 'User Form',
        message: 'User Form wants to update a users profile',
        data: {
          user: formUser,
        },
      };
      request(requestMsg, handleUserUpdated);
    } else if (type === 'create') {
      // send the created user to the server
      const requestMsg: CliRequestMsg = {
        event: 'user-create',
        source: 'User Form ',
        message: 'User Form wants to create a new user',
        data: {
          user: formUser,
        },
      };
      request(requestMsg, handleUserCreated);
    } else if (type === 'security') {
      // send the updated user to the server
      const requestMsg: CliRequestMsg = {
        event: 'user-security-update',
        source: 'User Form ',
        message: 'User Form  wants to update a users credentials',
        data: {
          user: formUser,
        },
      };
      request(requestMsg, handleUserUpdated);
    } else if (type === 'settings') {
      // send the updated user to the server
      const requestMsg: CliRequestMsg = {
        event: 'user-settings-update',
        source: 'User Form ',
        message: 'User Form  wants to update a users settings',
        data: {
          user: formUser,
        },
      };
      request(requestMsg, handleUserUpdated);
    }
  };

  /**
    ONLY when type = 'login'!  
    Sends a reset password to the websocket server.
    The answer is received as a websocket message.
    @param {string} email The email of a user who wants to reset his password
  */
  const handleForgotten = (email: string) => {
    const requestMsg: CliRequestMsg = {
      event: 'user-resetpw',
      source: 'User Form',
      message: 'User Form wants to reset a password',
      data: {
        email,
      },
    };
    request(requestMsg, handleResetPW);
  };

  return (
    <UserFormDisplay
      type={type}
      roles={roles}
      requestResult={requestResult}
      currentUser={currentUser}
      setCurrentUser={setCurrentUser}
      setRequestResult={setRequestResult}
      handleForgotten={handleForgotten}
      handleCurrentUser={handleCurrentUser}
    />
  );
};
export default UserForm;
