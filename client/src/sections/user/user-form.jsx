/*
  Author: André Kreienbring
  Renders the login, profile, security and create form.
  Depending on the passed in type property.
*/
import { useLocation } from 'react-router';
import { useState, useEffect, useCallback } from 'react';

import { useShelly } from 'src/sccontext';
import { publishEvent } from 'src/events/pubsub';

import UserFormDisplay from './user-form-display';

/**
  Presents a form to create / update / validate a user. Communicates with the 
  websocket server. The 'currentUser' is set to the logged in user OR to a user
  that must be updated from the UserView / UserTableRow list.
  @param {string} type Must be 'login', 'profile', 'security' , 'create' or 'settings'
  @param {object} updateuser The user that can be updated. Only set when a user
    from the list of users (UserView / UserTableRow) is updated
  @param {function} handleUsersReceived Will be used to update the list of all users
    in the UserView
  @param {function} handleUpdateUser When a user was updated this must be reflected in the UserView
*/
const UserForm = ({ type, updateuser, handleUsersReceived, handleUpdateUser }) => {
  const { login, user, request } = useShelly();
  const [currentUser, setCurrentUser] = useState(() => {
    if (type === 'profile' || type === 'settings' || type === 'security') {
      return typeof updateuser === 'undefined'
        ? {
            alias: user.alias,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            password: user.password,
            home: user.home,
            roleid: user.roleid,
            userid: user.userid,
            uuid: user.uuid,
          }
        : updateuser;
    }
    return {
      alias: '',
      email: '',
      firstname: '',
      lastname: '',
      password: '',
      home: 'dashboard',
      roleid: 3,
      test: false,
    };
  });
  const [roles, setRoles] = useState([]);
  const [requestResult, setRequestResult] = useState({ success: true, message: '' });
  const location = useLocation();

  /**
    ONLY when type = 'login'!  
    Called when a 'user validate' answer was received upon a former
    request that was send by 'handleSubmit'
    @param {object} msg The message that was passed with the answer
  */
  const handleUserValidation = useCallback((msg) => {
    if (msg.data.success) {
      setCurrentUser(msg.data.user);
    } else {
      setRequestResult({ success: false, message: msg.data.message });
    }
  }, []);

  /**
    ONLY when type = 'profile' or 'security'! 
    Called when a 'user profile update' or 'user security update' message was received upon a former
    request that was send by 'handleSubmit'
    Presents the result of the request and 
    @param {object} msg The message that was passed with the answer from the server
  */
  const handleUserUpdate = useCallback(
    (msg) => {
      setRequestResult({
        success: msg.data.success,
        message: msg.data.message,
      });
      if (user.userid === currentUser.userid) {
        // update the context user
        if(type === 'security') delete currentUser.password2;
        login(currentUser);
      }
      if (typeof handleUpdateUser !== 'undefined') {
        handleUpdateUser(currentUser);
      } else if (location.pathname === '/user') publishEvent('userUpdated', currentUser);
    },
    [user, currentUser, login, handleUpdateUser, location]
  );

  /**
    ONLY when type = 'create'! 
    Called when a 'user create' message was received upon a former
    request that was send by 'handleSubmit'
    @param {object} msg The mesage that was passed with the answer from the server
  */
  const handleUserCreate = useCallback(
    (msg) => {
      setRequestResult({
        success: msg.data.success,
        message: msg.data.message,
      });
      // if successful: update the users in UserView
      if (msg.data.success) handleUsersReceived(msg);
    },
    [handleUsersReceived]
  );

  /**
    Called when the requested list of roles 
    is received from the server.
    @param {object} msg The received ws message with the list of roles
  */
  const handleRolesReceived = useCallback((msg) => {
    setRoles(msg.data.roles);
  }, []);

  /**
   * Called when the password was reset
   * @param {object} msg The received ws message indicating if
   *  the reset was successful or not
   */
  const handleResetPW = useCallback((msg) => {
    setRequestResult({
      success: msg.data.success,
      message: msg.data.message,
    });
  }, []);

  // --------------------- Websocket Implementation BEGIN----------------
  /*
      When the user submits the login form or wants to reset his password messages
      are send to the websocket server. The server answers and the response is
      handled accordingly.
    */
  useEffect(() => {
    if (type === 'profile' || type === 'create')
      request(
        {
          event: 'roles get all',
          data: {
            source: 'Users Form',
            message: 'User Form needs the list of roles',
          },
        },
        handleRolesReceived
      );
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
  const handleCurrentUser = (formUser, isTest) => {
    if (type === 'login') {
      // send a validation request to validate the credentials
      const msg = {
        event: 'user validate',
        data: {
          source: 'User Form',
          message: 'User Form wants to validate a user',
          user: formUser,
          isTest,
        },
      };
      request(msg, handleUserValidation);
    } else if (type === 'profile') {
      // send the updated user to the server
      const msg = {
        event: 'user profile update',
        data: {
          source: 'User Form',
          message: 'User Form wants to update a users profile',
          user: formUser,
        },
      };
      request(msg, handleUserUpdate);
    } else if (type === 'create') {
      // send the created user to the server
      const msg = {
        event: 'user create',
        data: {
          source: 'User Form ',
          message: 'User Form wants to create a new user',
          user: formUser,
        },
      };
      request(msg, handleUserCreate);
    } else if (type === 'security') {
      // send the updated user to the server
      const msg = {
        event: 'user security update',
        data: {
          source: 'User Form ',
          message: 'User Form  wants to update a users credentials',
          user: formUser,
        },
      };
      request(msg, handleUserUpdate);
    } else if (type === 'settings') {
      // send the updated user to the server
      const msg = {
        event: 'user settings update',
        data: {
          source: 'User Form ',
          message: 'User Form  wants to update a users settings',
          user: formUser,
        },
      };
      request(msg, handleUserUpdate);
    }
  };

  /**
    ONLY when type = 'login'!  
    Sends a reset password to the websocket server.
    The answer is received as a websocket message.
    @param {string} email The email of a user who wants to reset his password
  */
  const handleForgotten = (email) => {
    const msg = {
      event: 'user resetpw',
      data: {
        source: 'User Form',
        message: 'User Form wants to reset a password',
        email,
      },
    };
    request(msg, handleResetPW);
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
