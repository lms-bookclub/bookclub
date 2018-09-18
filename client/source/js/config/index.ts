import { ClientConfig, Environment } from '@shared/types';
// @ts-ignore
import EnvConfig from '@env/@{ENV}-client';

export {
  Environment as Envs
};
export default (EnvConfig as ClientConfig);