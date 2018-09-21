import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { UserReducer } from 'reducers/UserReducer';
import { BookReducer } from 'reducers/BookReducer';
import { SeasonReducer } from 'reducers/SeasonReducer';
import { VotingSessionReducer } from 'reducers/VotingSessionReducer';
import { AppstateReducer } from 'reducers/AppstateReducer';
import { ReduxReducer } from 'reducers/ReduxReducer';

const reducers = combineReducers({
  routing: routerReducer,
  users: UserReducer,
  books: BookReducer,
  seasons: SeasonReducer,
  votingSession: VotingSessionReducer,
  appstate: AppstateReducer,
  redux: ReduxReducer,
});

export default reducers;