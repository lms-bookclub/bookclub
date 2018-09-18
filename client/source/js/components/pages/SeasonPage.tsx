import * as React from 'react';
import { Router, Route, Switch, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { withRouter } from 'react-router';
import { SeasonActions } from 'actions/SeasonActions';
import { OpenSeasonModalContainer } from 'components/containers/OpenSeasonModalContainer';
import { CreateNewGoalModalContainer } from 'components/containers/CreateNewGoalModalContainer';

class SeasonPage_ extends React.Component<any, any> {
  render() {
    const seasonJSON = JSON.stringify(this.props.currentSeason, null, 4);

    return (
      <div>
        <OpenSeasonModalContainer />
        <CreateNewGoalModalContainer />
        Current season info goes here:
        <pre>
          {seasonJSON}
        </pre>
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
    currentSeason: state.seasons[state.seasons.currentId] || {},
  }
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    componentDidMount() {
      dispatch(SeasonActions.fetchCurrent());
    },
  }
};

export const SeasonPage = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(SeasonPage_));