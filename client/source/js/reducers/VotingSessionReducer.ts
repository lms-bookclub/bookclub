import { VotingSessionActionTypes } from 'actions/VotingSessionActions';
import { VotingSession, ReduxAction } from 'types';
import { SeasonActionTypes } from 'actions/SeasonActions';

type VotingSessionState = {
  current: VotingSession;
  latest: VotingSession;
};

const defaultState: VotingSessionState = {
  current: null,
  latest: null,
};

export const VotingSessionReducer = (state: VotingSessionState = defaultState, action: ReduxAction) => {
  switch (action.type) {
    case VotingSessionActionTypes.GOT_LATEST:
      return {
        ...state,
        latest: action.votingSession,
      };
    case VotingSessionActionTypes.GOT_CURRENT:
      return {
        ...state,
        current: action.votingSession,
      };
    case VotingSessionActionTypes.GOT_CLOSE:
      return {
        ...state,
        latest: action.votingSession,
        current: null,
      };
    case VotingSessionActionTypes.GOT_OPEN:
      return {
        ...state,
        current: action.votingSession,
      };
    case VotingSessionActionTypes.GOT_VOTES_CAST:
      return {
        ...state,
        current: action.votingSession,
      };
    case SeasonActionTypes.GOT_CURRENT:
      return {
        ...state,
        current: action.current ? action.current.votingSession : null,
      };
    case SeasonActionTypes.GOT_OPEN:
      return {
        ...state,
        current: action.season ? action.season.votingSession : null,
      };
    default:
      return state
  }
};