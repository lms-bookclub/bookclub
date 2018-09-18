import * as React from 'react';
import { Router, Route, Switch, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { withRouter } from 'react-router';
import { BookList } from 'components/display/BookList';
import { EditBookDialog } from 'components/display/EditBookDialog';
import { BookActions, BookActionTypes } from 'actions/BookActions';
import { ReduxActions } from 'actions/ReduxActions';

class EditableBookListContainer_ extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: this.props.isOpen || false,
      book: null,
    };

    this.openModal = this.props.openModal || this.openModal.bind(this);
    this.closeModal = this.props.closeModal || this.closeModal.bind(this);
  }

  render() {
    const { isAdmin, myId } = this.props;

    return (
      <div>
        <BookList
          isAdmin={isAdmin}
          myId={myId}
          books={this.props.books}
          onItemEdit={this.onEditClick.bind(this)}
          onItemDelete={this.onDeleteClick.bind(this)}
          onItemPropose={this.onProposeClick.bind(this)}
          onItemRetract={this.onRetractClick.bind(this)}
        />

        <EditBookDialog
          handleClose={this.closeModal.bind(this)}
          onSubmit={this.onEditSubmit.bind(this)}
          open={this.state.isModalOpen}
          book={this.state.book}
        />
      </div>
    );
  }

  onEditSubmit(formState) {
    this.props.submit.call(this, this.state.book, formState);
  }

  onEditClick(book) {
    this.openModal(book);
  }

  onDeleteClick(book) {
    this.props.deleteBook(book);
  }

  onProposeClick(book) {
    this.props.proposeBook(book);
  }

  onRetractClick(book) {
    this.props.retractBook(book);
  }

  openModal(book) {
    this.setState({
      isModalOpen: true,
      book,
    });
  }

  closeModal() {
    this.setState({
      isModalOpen: false,
      book: null,
    });
  }
}

const mapStateToProps = (state: any) => {
  return {
    myId: state.users.myId,
    isAdmin: state.users.isAdmin,
  }
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    submit(book, formState) {
      const bookPostData = {
        ...book,
        title: formState.title,
        author: formState.author,
        pitch: formState.pitch,
        genre: formState.genre,
      };
      bookPostData.links.goodreads = formState.goodreads;
      bookPostData.links.image = formState.image;
      dispatch(ReduxActions.onNext(BookActionTypes.GOT_UPDATE, () => {
        this.closeModal();
      }));
      dispatch(BookActions.updateBook(bookPostData));
    },
    deleteBook(book) {
      dispatch(BookActions.deleteBook(book));
    },
    proposeBook(book) {
      const bookPostData = {
        _id: book._id,
        'dates.proposed': Date.now(),
      };
      dispatch(BookActions.updateBook(bookPostData));
    },
    retractBook(book) {
      const bookPostData = {
        _id: book._id,
        $unset: {
          'dates.proposed': 1,
        },
      };
      dispatch(BookActions.updateBook(bookPostData));
    },
  }
};

export const EditableBookListContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditableBookListContainer_));