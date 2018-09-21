import { BookActionTypes } from 'actions/BookActions';
import { Book, ReduxAction } from 'types';

type BookState = {
  [key: string]: Book;
};

const defaultState: BookState = {
};

export const BookReducer = (state: BookState = defaultState, action: ReduxAction) => {
  switch (action.type) {
    case BookActionTypes.GOT_LIST:
      return {
        ...action.books,
      };
    case BookActionTypes.GOT_CREATE:
      return {
        ...state,
        [action.book._id]: action.book,
      };
    case BookActionTypes.GOT_UPDATE:
      return {
        ...state,
        [action.book._id]: action.book,
      };
    case BookActionTypes.GOT_DELETE:
      delete state[action.book._id];
      return {
        ...state,
      };
    default:
      return state
  }
};