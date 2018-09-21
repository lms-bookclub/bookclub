import { ClientConfig, Environment } from '@shared/types/index';
import SharedClientConfig from './shared-client';

export const LocalClientConfig: ClientConfig = {
  ...SharedClientConfig,
  ENV: Environment.LOCAL,
  GA: '',
  SENTRY: '',
};

export default LocalClientConfig;