import * as React from 'react';
import { Router, Route, Switch, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';
import Config from 'config';
import { BookStatus, VotingSessionStatus } from 'types';
import { ReorderableList } from 'lib/reorderable-lists';
import { VotingSessionActions, VotingSessionActionTypes } from 'actions/VotingSessionActions';
import { ReduxActions } from 'actions/ReduxActions';
import { VoteCard } from 'components/display/VoteCard';
import { CloseVotingDialogButton } from 'components/display/CloseVotingDialogButton';
import { UserList } from 'components/display/UserList';

const pointsFor = (i) => Math.max(Config.MAX_VOTES - i, 0);

function populateBooks(list = [], books = {}) {
  return list.map(_ => ({
    ..._,
    book: books[_.book] || _.book,
  }));
}
function populateUsers(list = [], users = {}) {
  return list.map(_ => ({
    ..._,
    user: users[_.user] || _.user,
  }));
}

function sortBooks(books = {}, votes = [], me = null) {
  if(Object.keys(books).length < 1) return [];
  const myVotes = votes.filter(_ => (_.user._id || _.user) === me._id).reduce((map, vote) => {
    return {
      ...map,
      [vote.book]: vote.points,
    }
  }, {});
  const bookList = Object.keys(books).map(id => books[id]);
  let chosenBooks = [];
  let otherBooks = [];
  bookList.forEach(book => {
    if(book.status !== BookStatus.SUGGESTED) return;
    if(myVotes[book._id] > 0) {
      chosenBooks.push(book);
    } else {
      otherBooks.push(book);
    }
  });
  chosenBooks = chosenBooks.sort((a, b) => myVotes[b._id] - myVotes[a._id]);

  return [...chosenBooks, ...otherBooks];
}

function extractBookList(props) {
  return sortBooks(props.books, props.votingSession.votes, props.users[props.myId]);
}

class VotingSessionContainer_ extends React.Component<any, any> {
  closeVotingDialog: CloseVotingDialogButton;

  constructor(props) {
    super(props);

    this.state = {
      books: extractBookList(props),
      dirty: false,
    };
  }

  render() {
    const { books, dirty } = this.state;
    const { votingSession, users, isAdmin } = this.props;
    const booksMap = this.props.books;
    const isOpen = this.props.votingSession.status === VotingSessionStatus.OPEN;
    if (votingSession.votes) {
      votingSession.votes = populateBooks(votingSession.votes, booksMap);
      votingSession.votes = populateUsers(votingSession.votes, users);
    }
    if (votingSession.results) {
      votingSession.results = populateBooks(votingSession.results, booksMap);
    }
    const hasVoted = votingSession.votes ? votingSession.votes.some(_ => _.user._id === this.props.myId) : false;

    let usersHaveVoted: any = votingSession.votes.reduce((users, vote: any) => ({
      ...users,
      [vote.user._id]: true,
    }), {});
    let usersHaveNotVoted: any = Object.values(users).reduce((users, user: any) => {
      if(!usersHaveVoted[user._id]) {
        users[user._id] = true;
      }
      return users;
    }, {});
    usersHaveVoted = Object.keys(usersHaveVoted).map(_id => users[_id]).filter(_ => !!_);
    usersHaveNotVoted = Object.keys(usersHaveNotVoted).map(_id => users[_id]).filter(_ => !!_);

    return (
      <div className='c-voting-session'>
        {isAdmin ?
          <div className='c-voting-session__users-status'>
            {usersHaveVoted.length > 0 ?
              <UserList
                label='Voted'
                voters={usersHaveVoted}
              />
            : null}
            {usersHaveNotVoted.length > 0 ?
              <UserList
                label='Not Voted'
                voters={usersHaveNotVoted}
              />
            : null}
          </div>
        : null}
        <div className='o-action-row'>
          {isOpen ?
            <Button
              className='o-action'
              onClick={this.props.castVotes.bind(this)}
              disabled={!dirty}
            >
              {hasVoted ? 'Update Vote': 'Cast Vote'}
            </Button>
          : null}
          {isAdmin ?
            <CloseVotingDialogButton
              onRef={(ref) => this.closeVotingDialog = ref}
              onConfirm={this.props.closeVotingSession.bind(this)}
              books={this.props.books}
              votes={votingSession.votes}
              results={votingSession.results}
            />
          : null}
        </div>
        {isOpen ?
          <ReorderableList
            onUpdate={this.onListUpdate.bind(this)}
          >
            {books.map((book, i) =>
              <VoteCard
                key={book._id}
                i={i}
                points={pointsFor(i)}
                book={book}
                onVote={this.onVote.bind(this)}
              />
            )}
          </ReorderableList> : null}
      </div>
    );
  }

  onListUpdate(list) {
    const books = list.map(item => this.props.books[item.key]);
    this.setState({
      books,
      dirty: true,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      books: extractBookList(nextProps),
    });
  }

  onVote(book, points) {
    let books = this.state.books.slice(0);
    let i = Config.MAX_VOTES - points;
    books = books.filter(_ => _._id != book._id);
    books.splice(i, 0, book);

    this.setState({
      books,
      dirty: true,
    });
  }
}

const mapStateToProps = (state: any) => {
  return {
    isLoggedIn: state.users.isLoggedIn,
    isAdmin: state.users.isAdmin,
    myId: state.users.myId,
    users: state.users.users || {},
    books: state.books || {},
    votingSession: state.votingSession.currentId ? state.votingSession.sessions[state.votingSession.currentId] : {},
  }
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    castVotes() {
      const votes = this.state.books.slice(0, Config.MAX_VOTES).map((book, i) => ({
        user: this.props.myId,
        points: pointsFor(i),
        book: book._id,
      }));
      dispatch(ReduxActions.onNext(VotingSessionActionTypes.GOT_VOTES_CAST, () => {
        this.setState({
          dirty: false,
        })
      }));
      dispatch(VotingSessionActions.castVotes(votes));
    },

    closeVotingSession(book) {
      dispatch(ReduxActions.onNext(VotingSessionActionTypes.GOT_CLOSE, () => {
        this.closeVotingDialog.closeDialog();
      }));
      dispatch(VotingSessionActions.closeVotingSession(book));
    },
  }
};

export const VotingSessionContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(VotingSessionContainer_));