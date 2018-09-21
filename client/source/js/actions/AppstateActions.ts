export const PREFIX = `@Appstate`;
export const AppstateActionTypes = {
  SET_ADD_BOOK_MODAL: `${PREFIX}:SET_ADD_BOOK_MODAL`,
};

export const AppstateActions = {
  openAddBookModal: () => ({
    type: AppstateActionTypes.SET_ADD_BOOK_MODAL,
    state: true,
  }),
  closeAddBookModal: () => ({
    type: AppstateActionTypes.SET_ADD_BOOK_MODAL,
    state: false,
  }),
};