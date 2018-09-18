import Config from 'config/index';
import { BaseResourceClient } from 'clients/_BaseResourceClient';
import { fetch_ } from 'utils/service';

class VotingSessionClient extends BaseResourceClient {
  open() {
    return fetch_(`${Config.API_HOST}/api/actions/start-new-voting-session`, {
      method: 'POST',
      shouldAcceptStatus: _ => _ === 201,
    });
  }

  close(book) {
    return fetch_(`${Config.API_HOST}/api/actions/close-current-voting-session`, {
      method: 'POST',
      data: { book },
    });
  }

  castVotes(votes: any[]) {
    return fetch_(`${Config.API_HOST}/api/actions/vote-for-session`, {
      method: 'POST',
      data: votes,
    });
  }
}

export default new VotingSessionClient(`${Config.API_HOST}/api/voting-sessions`, 'voting sessions');
