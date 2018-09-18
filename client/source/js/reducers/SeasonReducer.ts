import { SeasonActionTypes } from 'actions/SeasonActions';
import { Season, ReduxAction } from 'types';
import { VotingSessionActionTypes } from 'actions/VotingSessionActions';

type SeasonState = {
  [key: string]: Season;
  currentId: string;
};

const defaultState: SeasonState = {
  currentId: null,
};

export const SeasonReducer = (state: SeasonState = defaultState, action: ReduxAction) => {
  switch (action.type) {
    case SeasonActionTypes.GOT_LIST:
      return {
        ...action.seasons,
      };
    case SeasonActionTypes.GOT_CURRENT:
      return action.current || action.previous ? {
        ...state,
        [action.current ? action.current._id: undefined]: action.current,
        [action.previous ? action.previous._id : undefined]: action.previous,
        currentId: action.current ? action.current._id : null,
        previousId: action.previous ? action.previous._id : null,
      } : {
        ...state,
        currentId: null,
        previousId: null
      };
    case SeasonActionTypes.GOT_CLOSE:
      return {
        ...state,
        [action.season._id]: action.season,
        currentId: null,
        previousId: state.currentId,
      };
    case SeasonActionTypes.GOT_OPEN:
      return {
        ...state,
        [action.season._id]: action.season,
        currentId: action.season._id,
        previousId: state.currentId,
      };
    case SeasonActionTypes.GOT_GOAL_CREATE:
      return {
        ...state,
        [action.season._id]: action.season,
      };
    case VotingSessionActionTypes.GOT_CLOSE:
      return {
        ...state,
        [action.season._id]: action.season,
        currentId: action.season._id,
      };
    case VotingSessionActionTypes.GOT_VOTES_CAST:
      return {
        ...state,
        [state.currentId]: {
          ...state[state.currentId],
          votingSession: action.votingSession,
        },
      };
    default:
      return state
  }
};