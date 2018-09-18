import { Environment, ServerConfig } from '@shared/types/index';
import SharedServerConfig from './shared-server';

// @ts-ignore
const PORT: number = process.env.PORT || 3000;
const HOST = `http://localhost`;

const LocalServerConfig: ServerConfig = {
  ...SharedServerConfig,
  ENV: Environment.LOCAL,
  HOST,
  PORT,
  SENTRY: '',
  MONGO_DB: `lms-bookclub-local`,
  MONGO_USER: null,
  MONGO_PW: null,
  SESSION_SECRET: 'sessionSecret',
  GOOGLE_AUTH_CLIENT_ID: 'fake-client-id',
  GOOGLE_AUTH_CLIENT_SECRET: 'fake-client-secret',
  GOOGLE_AUTH_CALLBACK_PATH: `${HOST}:${PORT}/auth/google/callback`,
};

export default LocalServerConfig;