import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';
import { AppstateActions } from 'actions/AppstateActions';
import { BookActions, BookActionTypes } from 'actions/BookActions';
import { ReduxActions } from 'actions/ReduxActions';
import { GenericModalContainer } from 'components/containers/GenericModalContainer';
import { EditBookDialog } from 'components/display/EditBookDialog';

export class AddBookModalContainer_ extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <GenericModalContainer
        renderTrigger={(modal) => this.props.isLoggedIn
          ? <Button color='primary' onClick={modal.openModal}>+ Add book</Button>
          : null}
        modalComponent={EditBookDialog}
        onSubmit={this.props.submit.bind(this)}
        openModal={this.props.openModal}
        closeModal={this.props.closeModal}
        isOpen={this.props.isAddBookModalOpen}
      />
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    myId: state.users.myId,
    isLoggedIn: state.users.isLoggedIn,
    isAdmin: state.users.isAdmin,
    isAddBookModalOpen: state.appstate.isAddBookModalOpen,
  }
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    submit(formState) {
      const bookPostData = {
        title: formState.title,
        author: formState.author,
        links: {
          goodreads: formState.goodreads,
          image: formState.image,
        },
        pitch: formState.pitch,
        genre: formState.genre,
        suggestedBy: this.props.myId,
      };
      dispatch(ReduxActions.onNext(BookActionTypes.GOT_CREATE, () => {
        dispatch(AppstateActions.closeAddBookModal());
      }));
      dispatch(BookActions.addBook(bookPostData));
    },
    closeModal() {
      dispatch(AppstateActions.closeAddBookModal());
    },
    openModal() {
      dispatch(AppstateActions.openAddBookModal());
    },
  }
};

export const AddBookModalContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddBookModalContainer_));