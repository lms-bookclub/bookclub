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
import { SeasonInfoAcceptance } from 'components/display/SeasonInfoAcceptance';
import { SeasonInfoWeighted } from 'components/display/SeasonInfoWeighted';

class CurrentPage_ extends React.Component<any, any> {
  openSeasonDialog: ConfirmDialogButton;

  render() {
    const {
      votingSession,
      currentSeason,
      isLoggedIn,
      isAdmin,
    } = this.props;

    const isVotingOpen = votingSession.status === VotingSessionStatus.OPEN;

    const SeasonInfo = votingSession.system === 'ACCEPTANCE_WITH_RANKED_TIEBREAKER'
      ? SeasonInfoAcceptance
      : SeasonInfoWeighted;

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
        {currentSeason ?
          <SeasonInfo
            books={this.props.books}
            title={currentSeason ? 'Current Season' : 'Previous Season'}
            season={currentSeason}
            votingSession={votingSession}
            onSeasonClose={this.props.closeCurrentSeason.bind(this)}
            allowClosing={isLoggedIn && isAdmin && currentSeason && !isVotingOpen}
            startVotingOpen={true}
          />
        : null}
        {isLoggedIn && currentSeason && isVotingOpen ?
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