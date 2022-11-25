import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { VotingSessionAcceptanceContainer } from 'components/hybrid/VotingSessionAcceptanceComponent';
import { VotingSessionWeightedContainer } from 'components/hybrid/VotingSessionWeightedComponent';
import {
  VotingSessionAdvancedAcceptanceContainer
} from '@client/components/hybrid/VotingSessionAdvancedAcceptanceComponent';

class VotingSessionContainer_ extends React.Component<any, any> {
  render() {
    const { votingSession } = this.props;

    const system = votingSession.system || 'WEIGHTED_3X';

    const VotingSession = {
      ['ACCEPTANCE_WITH_RANKED_TIEBREAKER']: VotingSessionAcceptanceContainer,
      ['ADVANCED_ACCEPTANCE']: VotingSessionAdvancedAcceptanceContainer,
      ['WEIGHTED_3X']: VotingSessionWeightedContainer,
    }[system] || VotingSessionWeightedContainer;

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