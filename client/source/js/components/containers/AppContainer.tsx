import * as React from 'react';
import { Router, Route, Switch, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { withRouter } from 'react-router';
import { HeaderContainer } from 'components/containers/HeaderContainer';

class AppContainer_ extends React.Component<any, any> {
  render() {
    return (
      <div>
        <HeaderContainer />
        <main>
          <div>{this.props.main}</div>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
  }
};

const mapDispatchToProps = (dispatch: any) => {
  return {
  }
};

export const AppContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppContainer_));