import Config from 'config';
import { fetch_ } from 'utils/service';

const BASE_PATH = `${Config.API_HOST}/api/actions`;

class ActionClient {
  constructor() {}

  findBookDetails(url) {
    return fetch_(`${BASE_PATH}/find-book-details`,{
      query: {
        url,
      },
      errorMessage: `Error finding book details`
    });
  }
}

export default new ActionClient();
