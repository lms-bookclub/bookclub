export const PREFIX = `@Redux`;
export const ReduxActionTypes = {
  ON_NEXT: `${PREFIX}:ON_NEXT`,
};

export const ReduxActions = {
  onNext: (triggerType, callback) => ({
    type: ReduxActionTypes.ON_NEXT,
    triggerType,
    callback,
  }),
};