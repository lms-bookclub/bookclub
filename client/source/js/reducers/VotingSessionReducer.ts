import { VotingSessionActionTypes } from 'actions/VotingSessionActions';
import { VotingSession, ReduxAction, Season } from 'types';
import { SeasonActionTypes } from 'actions/SeasonActions';

type VotingSessionState = {
  currentId: string;
  latestId: string;
  sessions: {
    [key: string]: VotingSession;
  };
};

const defaultState: VotingSessionState = {
  currentId: null,
  latestId: null,
  sessions: {},
};

export const VotingSessionReducer = (state: VotingSessionState = defaultState, action: ReduxAction): VotingSessionState => {
  switch (action.type) {
    case VotingSessionActionTypes.GOT_ALL:
      return {
        ...state,
        sessions: {
          ...state.sessions,
          ...action.votingSessions,
        },
      };
    case VotingSessionActionTypes.GOT_LATEST:
      return {
        ...state,
        latestId: action.votingSession._id,
        sessions: {
          ...state.sessions,
          [action.votingSession._id]: action.votingSession,
        },
      };
    case VotingSessionActionTypes.GOT_CURRENT:
      return {
        ...state,
        currentId: action.votingSession._id,
        sessions: {
          ...state.sessions,
          [action.votingSession._id]: action.votingSession,
        },
      };
    case VotingSessionActionTypes.GOT_CLOSE:
      return {
        ...state,
        currentId: null,
        latestId: action.votingSession._id,
        sessions: {
          ...state.sessions,
          [action.votingSession._id]: action.votingSession,
        },
      };
    case VotingSessionActionTypes.GOT_OPEN:
      return {
        ...state,
        currentId: action.votingSession._id,
        sessions: {
          ...state.sessions,
          [action.votingSession._id]: action.votingSession,
        },
      };
    case VotingSessionActionTypes.GOT_VOTES_CAST:
      return {
        ...state,
        currentId: action.votingSession._id,
        sessions: {
          ...state.sessions,
          [action.votingSession._id]: action.votingSession,
        },
      };
    case SeasonActionTypes.GOT_CURRENT:
      const votingSession = action.current ? action.current.votingSession : undefined;
      const id = votingSession ? votingSession._id : undefined;
      const { [id]: oldSession, ...sessions } = state.sessions;
      return {
        ...state,
        currentId: id || null,
        sessions: id ? {
          ...sessions,
          [id]: votingSession,
        } : { ...sessions },
      };
    case SeasonActionTypes.GOT_OPEN:
      return {
        ...state,
        currentId: action.season && action.season.votingSession ? action.season.votingSession._id : null,
        sessions: {
          ...state.sessions,
          [action.season && action.season.votingSession ? action.season.votingSession._id : null]: action.season.votingSession,
        },
      };
    default:
      return state
  }
};