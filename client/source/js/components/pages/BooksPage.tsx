import * as React from 'react';
import { Router, Route, Switch, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { withRouter } from 'react-router';
import Typography from '@material-ui/core/Typography';
import { EditableBookListContainer } from 'components/containers/EditableBookListContainer';
import { AddBookModalContainer } from 'components/containers/AddBookModalContainer';
import { AppstateActions } from 'actions/AppstateActions';
import { BookActions } from 'actions/BookActions';

class BooksPage_ extends React.Component<any, any> {
  render() {
    const { books, myId, isLoggedIn } = this.props;
    const myBooks = {};
    const notMyBooks = {};

    for(let id in books) {
      const book = books[id];
      if(book.suggestedBy === myId) {
        myBooks[id] = book;
      } else {
        notMyBooks[id] = book;
      }
    }

    return (
      <div className='l-books-page'>
        <div className='l-books-page__column'>
          <div className='o-action-title'>
            <Typography variant='display1'>Your Books</Typography>
            {isLoggedIn ? <AddBookModalContainer /> : null }
          </div>
          <EditableBookListContainer books={myBooks} />
        </div>
        <div className='l-books-page__column'>
          <Typography variant='display1'>Other Books</Typography>
          <EditableBookListContainer books={notMyBooks} />
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.props.componentDidMount();
  }
}

const mapStateToProps = (state: any) => {
  return {
    isLoggedIn: state.users.isLoggedIn,
    isAdmin: state.users.isAdmin,
    myId: state.users.myId,
    books: state.books || {},
  }
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    componentDidMount() {
      dispatch(BookActions.fetchBookList());
    },
    openAddBookModal() {
      dispatch(AppstateActions.openAddBookModal());
    },
  }
};

export const BooksPage = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(BooksPage_));