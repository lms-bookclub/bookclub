import * as express from 'express';
const routes = express.Router();

routes.use('/api', require('./api/index'));
routes.use('/auth', require('./auth/index'));
routes.use(require('./pages/index'));

module.exports = routes;
export {}