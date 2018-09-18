import * as express from 'express';
import passport from 'passport';
const routes = express.Router();

routes.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

routes.get('/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login'],
    session: true
  }));

routes.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/' // maybe /login-failed in the future
  }), (req, res) => {
    res.redirect('/');
  });

module.exports = routes;
export {}