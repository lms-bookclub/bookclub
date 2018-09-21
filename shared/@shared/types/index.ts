export * from './config';
export * from './schemas';

export type ReduxAction = {
  type: string;
  [key: string]: any;
};