import SeasonClient from 'clients/SeasonClient';

export const PREFIX = `@Season`;
export const SeasonActionTypes = {
  ASK_LIST: `${PREFIX}:ASK_LIST`,
  GOT_LIST: `${PREFIX}:GOT_LIST`,
  ASK_CURRENT: `${PREFIX}:ASK_CURRENT`,
  GOT_CURRENT: `${PREFIX}:GOT_CURRENT`,
  ASK_CLOSE: `${PREFIX}:ASK_CLOSE`,
  GOT_CLOSE: `${PREFIX}:GOT_CLOSE`,
  ASK_OPEN: `${PREFIX}:ASK_OPEN`,
  GOT_OPEN: `${PREFIX}:GOT_OPEN`,
  ASK_GOAL_CREATE: `${PREFIX}:ASK_GOAL_CREATE`,
  GOT_GOAL_CREATE: `${PREFIX}:GOT_GOAL_CREATE`,
};

export const SeasonActions = {
  requestSeasonList_: () => ({
    type: SeasonActionTypes.ASK_LIST,
  }),
  receiveSeasonList_: (seasons) => ({
    type: SeasonActionTypes.GOT_LIST,
    seasons,
    receivedAt: Date.now(),
  }),
  fetchSeasonList: (ids?, fields?) => (dispatch) => {
    dispatch(SeasonActions.requestSeasonList_());
    SeasonClient.fetchAll(ids, fields)
      .then(seasons => {
        dispatch(SeasonActions.receiveSeasonList_(seasons));
      });
  },

  requestCurrent_: () => ({
    type: SeasonActionTypes.ASK_CURRENT,
  }),
  receiveCurrent_: ({ current, previous }) => ({
    type: SeasonActionTypes.GOT_CURRENT,
    current,
    previous,
    receivedAt: Date.now(),
  }),
  fetchCurrent: () => (dispatch) => {
    dispatch(SeasonActions.requestCurrent_());
    SeasonClient.fetchOne('current')
      .then(res => {
        dispatch(SeasonActions.receiveCurrent_(res));
      });
  },

  requestCloseSeason_: (season) => ({
    type: SeasonActionTypes.ASK_CLOSE,
    season,
  }),
  receiveCloseSeason_: (season) => ({
    type: SeasonActionTypes.GOT_CLOSE,
    season,
    receivedAt: Date.now(),
  }),
  closeSeason: (season) => (dispatch) => {
    dispatch(SeasonActions.requestCloseSeason_(season));
    SeasonClient.close()
      .then(season_ => {
        dispatch(SeasonActions.receiveCloseSeason_(season_));
      });
  },

  requestOpenSeason_: () => ({
    type: SeasonActionTypes.ASK_OPEN,
  }),
  receiveOpenSeason_: (season) => ({
    type: SeasonActionTypes.GOT_OPEN,
    season,
    receivedAt: Date.now(),
  }),
  openSeason: () => (dispatch) => {
    dispatch(SeasonActions.requestOpenSeason_());
    SeasonClient.open()
      .then(season_ => {
        dispatch(SeasonActions.receiveOpenSeason_(season_));
      });
  },

  requestCreateNewGoal_: (seasonId, chapter) => ({
    type: SeasonActionTypes.ASK_GOAL_CREATE,
    seasonId,
    chapter,
  }),
  receiveCreateNewGoal_: (season) => ({
    type: SeasonActionTypes.GOT_GOAL_CREATE,
    season,
    receivedAt: Date.now(),
  }),
  createNewGoal: (seasonId, chapter) => (dispatch) => {
    dispatch(SeasonActions.requestCreateNewGoal_(seasonId, chapter));
    SeasonClient.createNewGoal(seasonId, {
      chapter,
    })
      .then(season_ => {
        dispatch(SeasonActions.receiveCreateNewGoal_(season_));
      });
  },
};