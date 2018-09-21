import { ISharedClientConfig } from '@shared/types/index';
// @ts-ignore
const pkg = require('../../client/package.json');

export const SharedClientConfig: ISharedClientConfig = {
  API_HOST: ``,
  MAX_VOTES: 3,
  CLIENT_VERSION: pkg.version,
};

export default SharedClientConfig;