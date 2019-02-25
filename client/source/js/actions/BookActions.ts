import BookClient from 'clients/BookClient';
import { Book } from '@shared/types';

export const PREFIX = `@Book`;
export const BookActionTypes = {
  ASK_LIST: `${PREFIX}:ASK_LIST`,
  GOT_LIST: `${PREFIX}:GOT_LIST`,
  ASK_CREATE: `${PREFIX}:ASK_CREATE`,
  GOT_CREATE: `${PREFIX}:GOT_CREATE`,
  ASK_UPDATE: `${PREFIX}:ASK_UPDATE`,
  GOT_UPDATE: `${PREFIX}:GOT_UPDATE`,
  ASK_RATE: `${PREFIX}:ASK_RATE`,
  GOT_RATE: `${PREFIX}:GOT_RATE`,
  ASK_DELETE: `${PREFIX}:ASK_DELETE`,
  GOT_DELETE: `${PREFIX}:GOT_DELETE`,
};

export const BookActions = {
  requestBookList_: () => ({
    type: BookActionTypes.ASK_LIST,
  }),
  receiveBookList_: (books) => ({
    type: BookActionTypes.GOT_LIST,
    books,
    receivedAt: Date.now(),
  }),
  fetchBookList: (ids?, fields?) => (dispatch) => {
    dispatch(BookActions.requestBookList_());
    BookClient.fetchAll(ids, fields)
      .then(books => {
        dispatch(BookActions.receiveBookList_(books));
      });
  },

  requestAddBook_: (book) => ({
    type: BookActionTypes.ASK_CREATE,
    book,
  }),
  receiveAddBook_: (book) => ({
    type: BookActionTypes.GOT_CREATE,
    book,
    receivedAt: Date.now(),
  }),
  addBook: (book) => (dispatch) => {
    dispatch(BookActions.requestAddBook_(book));
    BookClient.create(book)
      .then(book_ => {
        dispatch(BookActions.receiveAddBook_(book_));
      });
  },
  
  requestUpdateBook_: (book) => ({
    type: BookActionTypes.ASK_UPDATE,
    book,
  }),
  receiveUpdateBook_: (book) => ({
    type: BookActionTypes.GOT_UPDATE,
    book,
    receivedAt: Date.now(),
  }),
  updateBook: (book) => (dispatch) => {
    dispatch(BookActions.requestUpdateBook_(book));
    BookClient.update(book._id, book)
      .then(book_ => {
        dispatch(BookActions.receiveUpdateBook_(book_));
      });
  },
  
  requestRateBook_: (book) => ({
    type: BookActionTypes.ASK_RATE,
    book,
  }),
  receiveRateBook_: (book) => ({
    type: BookActionTypes.GOT_RATE,
    book,
    receivedAt: Date.now(),
  }),
  rateBook: (book: Book, { value, user }: { value: number, user: string }) => (dispatch) => {
    dispatch(BookActions.requestRateBook_(book));
    return BookClient.rate(book._id, {
      value,
      user,
    })
      .then(book_ => {
        dispatch(BookActions.receiveRateBook_(book_));
      });
  },
  
  requestDeleteBook_: (book) => ({
    type: BookActionTypes.ASK_DELETE,
    book,
  }),
  receiveDeleteBook_: (book) => ({
    type: BookActionTypes.GOT_DELETE,
    book,
    receivedAt: Date.now(),
  }),
  deleteBook: (book) => (dispatch) => {
    dispatch(BookActions.requestDeleteBook_(book));
    BookClient.delete(book._id)
      .then(() => {
        dispatch(BookActions.receiveDeleteBook_(book));
      });
  },
};