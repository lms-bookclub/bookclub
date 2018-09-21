import Config from 'config';
import * as path from 'path';
import * as express from 'express';
const routes = express.Router();

[
  '/',
  '/books',
  '/voting',
  '/season',
  '/current',
].forEach(route => {
  routes.get(route, (req, res) => {
    res.sendFile(path.resolve(Config.STATIC_FILES_PATH, 'index.html'));
  });
});

module.exports = routes;
export {}