import * as React from 'react';
import { connect } from 'react-redux';
import { Router, Route, Switch, browserHistory } from 'react-router'
import { browserHistory_ } from 'browser-history';
import { store } from 'reducers/store';
import { syncHistoryWithStore } from 'react-router-redux';
import { HomePage } from 'components/pages/HomePage';
import { BooksPage } from 'components/pages/BooksPage';
import { VotingPage } from 'components/pages/VotingPage';
import { SeasonsPage } from 'components/pages/SeasonsPage';
import { CurrentPage } from 'components/pages/CurrentPage';
import { AppContainer } from 'components/containers/AppContainer';
import { UserActions } from 'actions/UserActions';
import { BookActions } from 'actions/BookActions';

const history = syncHistoryWithStore(browserHistory_, store);

const routes = (
  <div>
    <div>
      <Route component={AppContainer}>
        <div>
          <Route exact path='/' components={{ main: CurrentPage }} />
          <Route exact path='/home' components={{ main: HomePage }} />
          <Route exact path='/books' components={{ main: BooksPage }} />
          <Route exact path='/voting' components={{ main: VotingPage }} />
          <Route exact path='/seasons' components={{ main: SeasonsPage }} />
          <Route exact path='/current' components={{ main: CurrentPage }} />
        </div>
      </Route>
    </div>
  </div>
);

class AppComponent_ extends React.Component<any, any> {
  render() {
    return (
      <div>
        <Router history={history}>
          {routes}
        </Router>
      </div>
    );
  }

  componentDidMount() {
    this.props.componentDidMount();
  }
}

const mapStateToProps = (state: any) => {
  return state;
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    componentDidMount() {
      dispatch(UserActions.fetchSelf());
      dispatch(UserActions.fetchAllUsers());
      dispatch(BookActions.fetchBookList());
    },
  }
};

export const AppComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppComponent_);
