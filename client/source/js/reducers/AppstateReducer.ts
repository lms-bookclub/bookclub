import { ReduxAction } from 'types/index';
import { AppstateActionTypes } from 'actions/AppstateActions';

type AppstateState = {
  isAddBookModalOpen: boolean,
};

const defaultState: AppstateState = {
  isAddBookModalOpen: false,
};

const AppstateReducer = (state: AppstateState = defaultState, action: ReduxAction) => {
  switch (action.type) {
    case AppstateActionTypes.SET_ADD_BOOK_MODAL:
      return {
        ...state,
        isAddBookModalOpen: action.state,
      };
    default:
      return state
  }
};

export {
  AppstateReducer,
};