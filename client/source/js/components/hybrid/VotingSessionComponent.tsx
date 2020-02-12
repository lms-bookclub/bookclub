import * as React from 'react';
import { Router, Route, Switch, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { withRouter } from 'react-router';
import { VotingSessionAcceptanceContainer } from 'components/hybrid/VotingSessionAcceptanceComponent';
import { VotingSessionWeightedContainer } from 'components/hybrid/VotingSessionWeightedComponent';

class VotingSessionContainer_ extends React.Component<any, any> {
  render() {
    const { votingSession } = this.props;

    const system = votingSession.system || 'WEIGHTED_3X';

    const VotingSession = system === 'ACCEPTANCE_WITH_RANKED_TIEBREAKER'
      ? VotingSessionAcceptanceContainer : VotingSessionWeightedContainer;

    return (
      <React.Fragment>
        <VotingSession />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    votingSession: state.votingSession.currentId ? state.votingSession.sessions[state.votingSession.currentId] : {},
  }
};

const mapDispatchToProps = (dispatch: any) => {
  return {
  }
};

export const VotingSessionContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(VotingSessionContainer_));