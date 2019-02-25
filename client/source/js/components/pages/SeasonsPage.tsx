import * as React from 'react';
import { Router, Route, Switch, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { withRouter } from 'react-router';
import { timeOf, toStandardString } from '@client/utils/dates';
import { SeasonActions } from 'actions/SeasonActions';
import { BookActions } from 'actions/BookActions';
import { SeasonInfo } from 'components/display/SeasonInfo';
import { VotingSessionActions } from '@client/actions/VotingSessionActions';
import { Book, Season, SeasonStatus } from '@shared/types';

class SeasonsPage_ extends React.Component<any, any> {
  render() {
    const {
      seasons,
      isLoggedIn,
      isAdmin,
      myId,
    } = this.props;

    const seasonList = Object.keys(seasons)
      .map(id => seasons[id])
      .filter(season => season.status === SeasonStatus.COMPLETE)
      .sort((a, b) => timeOf(b.dates.finished) - timeOf(a.dates.finished));

    return (
      <div className='l-current-page'>
        {seasonList.map((season, i) => {
          if (season.book) {
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
            onSeasonRename={isLoggedIn && isAdmin && season && season.status === SeasonStatus.COMPLETE && this.props.renameSeason.bind(this, season)}
            onSeasonClose={this.props.closeSeason.bind(this, season)}
            onRateBook={isLoggedIn && season && season.status === SeasonStatus.COMPLETE &&  this.props.rateBook.bind(this)}
            allowClosing={isLoggedIn && isAdmin && season && season.status === SeasonStatus.STARTED}
            startVotingOpen={false}
            myId={myId}
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
    myId: state.users.myId,
    seasons: state.seasons.seasons,
    votingSessions: state.votingSession.sessions || {},
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

    closeSeason(season: Season) {
      dispatch(SeasonActions.closeSeason(season));
    },

    renameSeason(season: Season, title: string) {
      dispatch(SeasonActions.updateSeason(season, {
        title
      }));
    },

    openNewSeason() {
      dispatch(SeasonActions.openSeason());
    },

    rateBook({ book, value } : { book: Book, value: number }) {
      const user = this.props.myId;
      dispatch(BookActions.rateBook(book, {
        value,
        user,
      }));
    },
  }
};

export const SeasonsPage = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(SeasonsPage_));