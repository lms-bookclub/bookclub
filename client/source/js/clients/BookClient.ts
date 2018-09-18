import Config from 'config';
import { BaseResourceClient } from 'clients/_BaseResourceClient';

class BookClient extends BaseResourceClient {}

export default new BookClient(`${Config.API_HOST}/api/books`, 'books');
