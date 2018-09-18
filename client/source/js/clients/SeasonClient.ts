import Config from 'config/index';
import { BaseResourceClient } from 'clients/_BaseResourceClient';
import { create, fetch_ } from 'utils/service';

class SeasonClient extends BaseResourceClient {
  open() {
    return fetch_(`${Config.API_HOST}/api/actions/start-new-season`, {
      method: 'POST',
      shouldAcceptStatus: _ => _ === 201,
    });
  }

  close() {
    return fetch_(`${Config.API_HOST}/api/actions/close-current-season`, {
      method: 'POST',
      shouldAcceptStatus: _ => _ === 200,
    });
  }

  createNewGoal(seasonId, goal) {
    return create(null, goal, {
      url: `${this.basePath}/${seasonId}/goals`,
      errorMessage: `Error creating goal ${seasonId}`,
      shouldAcceptStatus: _ => _ === 200,
    });
  }
}

export default new SeasonClient(`${Config.API_HOST}/api/seasons`, 'seasons');
