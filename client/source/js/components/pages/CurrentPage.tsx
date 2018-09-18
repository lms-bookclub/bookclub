import * as React from 'react';
import { Router, Route, Switch, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { withRouter } from 'react-router';
import DialogContentText from '@material-ui/core/DialogContentText';
import { VotingSessionStatus } from 'types';
import { SeasonActions } from 'actions/SeasonActions';
import { ConfirmDialogButton } from 'components/display/ConfirmDialogButton';
import { VotingSessionContainer } from 'components/hybrid/VotingSessionComponent';
import { SeasonInfo } from 'components/display/SeasonInfo';

class CurrentPage_ extends React.Component<any, any> {
  openSeasonDialog: ConfirmDialogButton;

  render() {
    const {
      votingSession,
      currentSeason,
      previousSeason,
      isLoggedIn,
      isAdmin,
    } = this.props;

    const displaySeason = currentSeason || previousSeason;

    return (
      <div className='l-current-page'>
        {isLoggedIn && isAdmin ?
          <div>
            {!currentSeason ?
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
        {displaySeason ?
          <SeasonInfo
            books={this.props.books}
            title={currentSeason ? 'Current Season' : 'Previous Season'}
            season={displaySeason}
            votingSession={votingSession}
            onSeasonClose={this.props.closeCurrentSeason.bind(this)}
            allowJsonViewing={isLoggedIn && isAdmin}
            allowClosing={isLoggedIn && isAdmin && currentSeason}
          />
        : null}
        {isLoggedIn && currentSeason && votingSession.status === VotingSessionStatus.OPEN ?
          <VotingSessionContainer />
        : null}
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
    previousSeason: state.seasons[state.seasons.previousId],
    currentSeason: state.seasons[state.seasons.currentId],
    votingSession: state.votingSession.current || state.votingSession.latest || {},
    books: state.books || {},
  }
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    componentDidMount() {
      dispatch(SeasonActions.fetchCurrent());
    },

    closeCurrentSeason() {
      dispatch(SeasonActions.closeSeason(this.props.currentSeason));
    },

    openNewSeason() {
      dispatch(SeasonActions.openSeason());
    },
  }
};

export const CurrentPage = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(CurrentPage_));