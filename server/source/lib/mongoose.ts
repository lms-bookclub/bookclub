import mongoose from 'mongoose';
import Config from 'config';
import { Environment } from '@shared/types';

/**
 * Generates a Mongo URI from a mongo DB name.
 * @param {string} db the database name
 */
export function mongoURI(db: string): string {
  return `mongodb://localhost/${db}`;
}

export function connectMongoose() {
  const connectArgs: any = {};
  const uri = mongoURI(Config.MONGO_DB);

  if (Config.MONGO_USER && Config.MONGO_PW) {
    connectArgs.user = encodeURIComponent(Config.MONGO_USER);
    connectArgs.pass = encodeURIComponent(Config.MONGO_PW);
  }

  console.log('Attempting to connect to mongo', uri, connectArgs);

  mongoose.connect(uri, connectArgs)
    .then(msg => {
      console.log('Mongoose connected', msg);
    })
    .catch(err => {
      console.log('Mongoose failed to connect', err);
    });

  if (Config.ENV === Environment.LOCAL || Config.ENV === Environment.STAGING) {
    mongoose.set('debug', true);
  }
}

export default mongoose;