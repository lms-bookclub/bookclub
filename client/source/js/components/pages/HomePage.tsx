import * as React from 'react';
import { Router, Route, Switch, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { withRouter } from 'react-router';
import { AppstateActions } from 'actions/AppstateActions';

class HomePage_ extends React.Component<any, any> {
  render() {
    return (
      <div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    isLoggedIn: state.users.isLoggedIn,
    isAdmin: state.users.isAdmin,
  }
};

const mapDispatchToProps = (dispatch: any) => {
  return {
  }
};

export const HomePage = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomePage_));