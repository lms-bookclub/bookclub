import * as React from 'react';
import { Router, Route, Switch, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { withRouter } from 'react-router';
import DialogContentText from '@material-ui/core/DialogContentText';
import { toStandardString } from '@client/utils/dates';
import { SeasonActions } from 'actions/SeasonActions';
import { BookActions } from 'actions/BookActions';
import { ConfirmDialogButton } from 'components/display/ConfirmDialogButton';
import { SeasonInfo } from 'components/display/SeasonInfo';
import { VotingSessionActions } from '@client/actions/VotingSessionActions';

class SeasonsPage_ extends React.Component<any, any> {
  openSeasonDialog: ConfirmDialogButton;

  render() {
    const {
      seasons,
      isLoggedIn,
      isAdmin,
    } = this.props;

    const seasonList = Object.keys(seasons).map(id => seasons[id]).sort((a, b) => {
      return new Date(b.dates.finished || Date.now()).getTime() - new Date(a.dates.finished || Date.now()).getTime();
    });

    return (
      <div className='l-current-page'>
        {isLoggedIn && isAdmin ?
          <div>
            {!true ?
              <ConfirmDialogButton
                title='Open new season?'
                content={
                  <DialogContentText>This will start a brand new season, and start a voting session for a new book.</DialogContentText>
                }
                confirmText='Open Season'
                onRef={(ref) => (this.openSeasonDialog = ref)}
                onConfirm={this.props.openNewSeason.bind(this)}
              >
                Open New Season
              </ConfirmDialogButton>
              : null}
          </div>
          : null}
        {seasonList.map((season, i) => {
          if (season.book && typeof season.book === 'string') {
            season.book = this.props.books[season.book._id || season.book] || season.book;
          }

          const title = season.book && season.book.title
            ? season.book.title
            : season.dates.finished
              ? toStandardString(season.dates.finished)
              : 'Current Season';

          const votingSession = this.props.votingSessions[season.votingSession] || {};

          const books = votingSession.booksVotedOn && votingSession.booksVotedOn.length > 0
            ? votingSession.booksVotedOn.reduce((books, bookId) => {
              return {
                ...books,
                [bookId]: this.props.books[bookId],
              }
            }, {})
            : this.props.books;

          return <SeasonInfo
            key={i}
            books={books}
            title={title}
            season={season}
            votingSession={votingSession}
            onSeasonClose={this.props.closeCurrentSeason.bind(this)}
            allowJsonViewing={isLoggedIn && isAdmin}
            allowClosing={false}
            startVotingOpen={false}
          />
        })}
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
    seasons: state.seasons.seasons,
    votingSessions: state.votingSession.sessions || {},
    previousSeason: state.seasons.seasons[state.seasons.previousId],
    currentSeason: state.seasons.seasons[state.seasons.currentId],
    votingSession: state.votingSession.currentId ? state.votingSession.sessions[state.votingSession.currentId]
      : state.votingSession.latestId ? state.votingSession.sessions[state.votingSession.latestId]
      : {},
    books: state.books || {},
  }
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    componentDidMount() {
      dispatch(BookActions.fetchBookList());
      dispatch(VotingSessionActions.fetchAll());
      dispatch(SeasonActions.fetchSeasonList());
    },

    closeCurrentSeason() {
      dispatch(SeasonActions.closeSeason(this.props.currentSeason));
    },

    openNewSeason() {
      dispatch(SeasonActions.openSeason());
    },
  }
};

export const SeasonsPage = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(SeasonsPage_));