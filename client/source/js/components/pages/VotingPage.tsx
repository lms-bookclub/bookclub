import * as React from 'react';
import { Router, Route, Switch, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';
import { VotingSessionStatus } from 'types';
import { VotingSessionActions } from 'actions/VotingSessionActions';
import { VotingSessionContainer } from 'components/hybrid/VotingSessionComponent';

class VotingPage_ extends React.Component<any, any> {
  render() {
    const isOpen = this.props.votingSession.status === VotingSessionStatus.OPEN;

    return (
      <div>
        {this.props.isAdmin
          ? <Button variant='contained' color='primary' onClick={this.props.startVotingSession}>Start voting session</Button>
          : <div/> }
        {this.props.isAdmin && isOpen
          ? <Button variant='contained' color='secondary' onClick={this.props.closeVotingSession}>Close voting session</Button>
          : <div/> }
        <VotingSessionContainer />
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
    books: state.books,
    votingSession: state.votingSession.current || state.votingSession.latest || {},
  }
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    componentDidMount() {
      dispatch(VotingSessionActions.fetchCurrent());
      dispatch(VotingSessionActions.fetchLatest());
    },
    startVotingSession() {
      dispatch(VotingSessionActions.openVotingSession());
    },
    closeVotingSession() {
      // dispatch(VotingSessionActions.closeVotingSession());
    },
  }
};

export const VotingPage = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(VotingPage_));