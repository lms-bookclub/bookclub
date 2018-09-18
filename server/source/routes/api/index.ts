import express from 'express';
import * as parser from 'body-parser';
const routes = express.Router();

routes.use(parser.json());

routes.use('/users', require('./users'));
routes.use('/books', require('./books'));
routes.use('/seasons', require('./seasons'));
routes.use('/voting-sessions', require('./voting-sessions'));
routes.use('/actions', require('./actions'));

module.exports = routes;
export {}