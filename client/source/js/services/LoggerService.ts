import Config, { Envs } from 'config';

export const Levels = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  LOG: 'LOG',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
};

export const Tags = {

};

class LoggingService {
  debug(...args) {
    if(Config.ENV === Envs.LOCAL) {
      // let tag = null;
      // this.log_(Levels.DEBUG, ...args);
      console.debug(args[0], ...args.slice(1));
    }
  }
  log(...args) {
    if(Config.ENV === Envs.LOCAL || Config.ENV === Envs.STAGING) {
      // let tag = null;
      // this.log_(Levels.LOG, ...args);
      console.log(args[0], ...args.slice(1));
    }
  }
  warning(...args) {
    // let tag = null;
    // this.log_(Levels.WARNING, ...args);
    console.warn(args[0], ...args.slice(1));
  }
  error(...args) {
    // let tag = null;
    // this.log_(Levels.ERROR, ...args);
    console.error(args[0], ...args.slice(1));
  }

  log_(level, data) {
    let log =
      level === Levels.DEBUG ? console.debug :
        level === Levels.ERROR ? console.error :
          level === Levels.INFO ? console.info :
            level === Levels.WARNING ? console.warn
              : console.log;

    log(data[0], ...data.slice(1));
  }
}

export default new LoggingService();
