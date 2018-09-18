import UserClient from 'clients/UserClient';

export const PREFIX = `@User`;
export const UserActionTypes = {
  ASK_SELF: `${PREFIX}:ASK_SELF`,
  GOT_SELF: `${PREFIX}:GOT_SELF`,
  ASK_ALL: `${PREFIX}:ASK_ALL`,
  GOT_ALL: `${PREFIX}:GOT_ALL`,
};

export const UserActions = {
  requestSelf_: () => ({
    type: UserActionTypes.ASK_SELF,
  }),
  receiveSelf_: (self) => ({
    type: UserActionTypes.GOT_SELF,
    user: self,
    receivedAt: Date.now(),
  }),
  fetchSelf: () => (dispatch) => {
    dispatch(UserActions.requestSelf_());
    UserClient.fetchMe()
      .then(user => {
        dispatch(UserActions.receiveSelf_(user));
      });
  },
  
  requestAllUsers_: () => ({
    type: UserActionTypes.ASK_ALL,
  }),
  receiveAllUsers_: (users) => ({
    type: UserActionTypes.GOT_ALL,
    users,
    receivedAt: Date.now(),
  }),
  fetchAllUsers: () => (dispatch) => {
    dispatch(UserActions.requestAllUsers_());
    UserClient.fetchAll()
      .then(users => {
        dispatch(UserActions.receiveAllUsers_(users));
      });
  },
};