import Config from 'config';
import LoggerService from 'services/LoggerService';
import { fetchAll } from 'utils/service';
import { User } from 'types';

const BASE_PATH = `${Config.API_HOST}/api/users`;

class UserClient {
  constructor() {}

  fetchAll(query?, fields?) {
    return fetchAll(BASE_PATH,{
      query,
      fields,
      errorMessage: `Error fetching user list`
    });
  }

  fetchMe() {
    return fetch(`${BASE_PATH}/me/`, { credentials: 'include' })
      .then((response) => response.status === 200 ? response.json() : null)
      .catch((err) => {
        LoggerService.error(`Error fetching self user data`, err);
      });
  }

  isAdmin(user: User) {
    return user && user.roles && user.roles.indexOf('ADMIN') > -1;
  }
}

export default new UserClient();
