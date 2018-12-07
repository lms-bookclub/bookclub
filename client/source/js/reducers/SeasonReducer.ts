import { SeasonActionTypes } from 'actions/SeasonActions';
import { Season, ReduxAction } from 'types';
import { VotingSessionActionTypes } from 'actions/VotingSessionActions';

type SeasonState = {
  seasons: {
    [key: string]: Season;
  };
  currentId: string;
  previousId: string;
};

const defaultState: SeasonState = {
  currentId: null,
  previousId: null,
  seasons: {},
};

export const SeasonReducer = (state: SeasonState = defaultState, action: ReduxAction): SeasonState => {
  switch (action.type) {
    case SeasonActionTypes.GOT_LIST:
      return {
        ...state,
        seasons: {
          ...action.seasons
        },
      };
    case SeasonActionTypes.GOT_CURRENT:
      const currentId = action.current ? action.current._id: undefined;
      const previousId = action.previous ? action.previous._id: undefined;
      const { [currentId]: currentSeason, [previousId]: previousSeason, ...seasons } = state.seasons;

      if (currentId) {
        seasons[currentId] = action.current;
      }
      if (previousId) {
        seasons[previousId] = action.previous;
      }

      return action.current || action.previous ? {
        ...state,
        seasons: seasons,
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
        seasons: {
          ...state.seasons,
          [action.season._id]: action.season,
        },
        currentId: null,
        previousId: state.currentId,
      };
    case SeasonActionTypes.GOT_OPEN:
      return {
        ...state,
        seasons: {
          ...state.seasons,
          [action.season._id]: action.season,
        },
        currentId: action.season._id,
        previousId: state.currentId,
      };
    case SeasonActionTypes.GOT_GOAL_CREATE:
      return {
        ...state,
        seasons: {
          ...state.seasons,
          [action.season._id]: action.season,
        },
      };
    case VotingSessionActionTypes.GOT_CLOSE:
      return {
        ...state,
        seasons: {
          ...state.seasons,
          [action.season._id]: action.season,
        },
        currentId: action.season._id,
      };
    case VotingSessionActionTypes.GOT_VOTES_CAST:
      return {
        ...state,
        seasons: {
          ...state.seasons,
          [state.currentId]: {
            ...state.seasons[state.currentId],
            votingSession: action.votingSession,
          },
        }
      };
    default:
      return state
  }
};