import { ISharedServerConfig } from '@shared/types/index';
// @ts-ignore: Path from: ./server/dist/@env
const pkg = require('../../package.json');

const SharedServerConfig: ISharedServerConfig = {
  SERVER_VERSION: pkg.version,
  //Path from: ./server
  STATIC_FILES_PATH: '../client/dist',
  BOOKSCRAPS_API_KEY: 'fake-api-key',
};

export default SharedServerConfig;