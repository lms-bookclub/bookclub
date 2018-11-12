import VotingSessionClient from 'clients/VotingSessionClient';

export const PREFIX = `@VotingSession`;
export const VotingSessionActionTypes = {
  ASK_ALL: `${PREFIX}:ASK_ALL`,
  GOT_ALL: `${PREFIX}:GOT_ALL`,
  ASK_CURRENT: `${PREFIX}:ASK_CURRENT`,
  GOT_CURRENT: `${PREFIX}:GOT_CURRENT`,
  ASK_LATEST: `${PREFIX}:ASK_LATEST`,
  GOT_LATEST: `${PREFIX}:GOT_LATEST`,
  ASK_CLOSE: `${PREFIX}:ASK_CLOSE`,
  GOT_CLOSE: `${PREFIX}:GOT_CLOSE`,
  ASK_OPEN: `${PREFIX}:ASK_OPEN`,
  GOT_OPEN: `${PREFIX}:GOT_OPEN`,
  ASK_VOTES_CAST: `${PREFIX}:ASK_VOTES_CAST`,
  GOT_VOTES_CAST: `${PREFIX}:GOT_VOTES_CAST`,
};

export const VotingSessionActions = {
  requestAll_: () => ({
    type: VotingSessionActionTypes.ASK_ALL,
  }),
  receiveAll_: (votingSessions) => ({
    type: VotingSessionActionTypes.GOT_ALL,
    votingSessions,
    receivedAt: Date.now(),
  }),
  fetchAll: () => (dispatch) => {
    dispatch(VotingSessionActions.requestAll_());
    VotingSessionClient.fetchAll()
      .then(votingSessions => {
        dispatch(VotingSessionActions.receiveAll_(votingSessions));
      });
  },

  requestCurrent_: () => ({
    type: VotingSessionActionTypes.ASK_CURRENT,
  }),
  receiveCurrent_: (votingSession) => ({
    type: VotingSessionActionTypes.GOT_CURRENT,
    votingSession,
    receivedAt: Date.now(),
  }),
  fetchCurrent: () => (dispatch) => {
    dispatch(VotingSessionActions.requestCurrent_());
    VotingSessionClient.fetchOne('current')
      .then(votingSession => {
        dispatch(VotingSessionActions.receiveCurrent_(votingSession));
      });
  },

  requestLatest_: () => ({
    type: VotingSessionActionTypes.ASK_LATEST,
  }),
  receiveLatest_: (votingSession) => ({
    type: VotingSessionActionTypes.GOT_LATEST,
    votingSession,
    receivedAt: Date.now(),
  }),
  fetchLatest: () => (dispatch) => {
    dispatch(VotingSessionActions.requestLatest_());
    VotingSessionClient.fetchOne('latest')
      .then(votingSession => {
        dispatch(VotingSessionActions.receiveLatest_(votingSession));
      });
  },

  requestCloseVotingSession_: (book) => ({
    type: VotingSessionActionTypes.ASK_CLOSE,
    book,
  }),
  receiveCloseVotingSession_: (season) => ({
    type: VotingSessionActionTypes.GOT_CLOSE,
    votingSession: season.votingSession,
    season,
    receivedAt: Date.now(),
  }),
  closeVotingSession: (book) => (dispatch) => {
    dispatch(VotingSessionActions.requestCloseVotingSession_(book));
    VotingSessionClient.close(book)
      .then(season_ => {
        dispatch(VotingSessionActions.receiveCloseVotingSession_(season_));
      });
  },

  requestOpenVotingSession_: () => ({
    type: VotingSessionActionTypes.ASK_OPEN,
  }),
  receiveOpenVotingSession_: (votingSession) => ({
    type: VotingSessionActionTypes.GOT_OPEN,
    votingSession,
    receivedAt: Date.now(),
  }),
  openVotingSession: () => (dispatch) => {
    dispatch(VotingSessionActions.requestOpenVotingSession_());
    VotingSessionClient.open()
      .then(votingSession_ => {
        dispatch(VotingSessionActions.receiveOpenVotingSession_(votingSession_));
      });
  },

  requestCastVotes_: (votes) => ({
    type: VotingSessionActionTypes.ASK_VOTES_CAST,
    votes,
  }),
  receiveCastVotes_: (votingSession) => ({
    type: VotingSessionActionTypes.GOT_VOTES_CAST,
    votingSession,
    receivedAt: Date.now(),
  }),
  castVotes: (votes: any[]) => (dispatch) => {
    dispatch(VotingSessionActions.requestCastVotes_(votes));
    VotingSessionClient.castVotes(votes)
      .then(votingSession_ => {
        dispatch(VotingSessionActions.receiveCastVotes_(votingSession_));
      });
  },
};