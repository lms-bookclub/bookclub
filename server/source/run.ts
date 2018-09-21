import { connectMongoose } from 'lib/mongoose';
import Config from 'config';
import server from './index';

connectMongoose();

server.listen(Config.PORT, () => {
  console.log(`Bookclub server listening on port ${Config.PORT}`);
});
