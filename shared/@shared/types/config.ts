export enum Environment {
  LOCAL = 'LOCAL',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
}

export type ClientConfig = {
  ENV: Environment;
  API_HOST: string;
  MAX_VOTES: number;
  CLIENT_VERSION: string;
  GA: string;
  SENTRY: string;
}

export interface ISharedClientConfig extends Partial<ClientConfig> {
  API_HOST: string;
  MAX_VOTES: number;
  CLIENT_VERSION: string;
}

export type ServerConfig = {
  ENV: Environment;
  SERVER_VERSION: string;
  HOST: string;
  PORT: number;
  STATIC_FILES_PATH: string;
  SENTRY: string;
  MONGO_DB: string;
  MONGO_USER: string;
  MONGO_PW: string;
  SESSION_SECRET: string;
  GOOGLE_AUTH_CLIENT_ID: string;
  GOOGLE_AUTH_CLIENT_SECRET: string;
  GOOGLE_AUTH_CALLBACK_PATH: string;
}

export interface ISharedServerConfig extends Partial<ServerConfig> {
  SERVER_VERSION: string;
  STATIC_FILES_PATH: string;
}
