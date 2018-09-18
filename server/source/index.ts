import Config from 'config';
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import connectMongo from 'connect-mongo';
// import raven from 'raven';
// import initSockets from 'sockets';
import { server } from 'lib/io';
import initPassport from 'lib/passport';
import mongoose from 'lib/mongoose';
const routes = require('routes');

const MongoStore = connectMongo(session);

server.use(morgan('dev'));

server.use(express.static(Config.STATIC_FILES_PATH));
server.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
  }),
  secret: Config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
initPassport(server);
server.use(routes);

// initSockets();

// module.exports = http;
// module.exports = server;
export default server;
