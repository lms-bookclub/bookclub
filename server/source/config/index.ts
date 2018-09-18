import { ServerConfig } from '@shared/types';

const env = process.env.ENV;

if(!env) {
  throw 'ENV not set.'
}

const configPath = `@env/${env.toLowerCase()}-server`;
const Config: ServerConfig = require(configPath).default;

export default Config;