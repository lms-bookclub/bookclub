import Config from 'config';
import { BaseResourceClient } from 'clients/_BaseResourceClient';
import { fetch_ } from '@client/utils/service';

class BookClient extends BaseResourceClient {
  rate(book: string, { value, user }) {
    return fetch_(`${Config.API_HOST}/api/actions/rate-book`, {
      method: 'PATCH',
      shouldAcceptStatus: _ => _ === 200,
      data: {
        book,
        value,
        user,
      }
    });
  }
}

export default new BookClient(`${Config.API_HOST}/api/books`, 'books');
