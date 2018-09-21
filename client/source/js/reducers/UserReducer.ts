import { UserActionTypes } from 'actions/UserActions';
import UserClient from 'clients/UserClient';
import { User, ReduxAction } from 'types';

type UserState = {
  users: {
    [key: string]: User;
  },
  myId?: string;
  isLoggedIn: boolean;
  isAdmin: boolean;
};

const defaultState: UserState = {
  users: {},
  isLoggedIn: false,
  isAdmin: false,
};

export const UserReducer = (state: UserState = defaultState, action: ReduxAction) => {
  switch (action.type) {
    case UserActionTypes.GOT_ALL:
      return {
        ...state,
        users: {
          ...state.users,
          ...action.users,
        }
      };
    case UserActionTypes.GOT_SELF:
      return action.user ? {
        users: {
          ...state.users,
          [action.user._id]: action.user
        },
        myId: action.user._id,
        isLoggedIn: true,
        isAdmin: UserClient.isAdmin(action.user),
      } : {
        ...state,
        myId: null,
        isLoggedIn: false,
        isAdmin: false,
      };
    default:
      return state
  }
};