import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Config from 'config/index';
import { UserModel } from 'schemas/user';

export default function initPassport(server) {

  server.use(passport.initialize());
  server.use(passport.session());

  passport.serializeUser(function(user: any, done) {
    done(null, user._id);
  });
  passport.deserializeUser(function(userId, done) {
    UserModel.findOne({ _id: userId }, function (err, user) {
      done(err, user);
    });
  });
  passport.use(new GoogleStrategy({
      clientID: Config.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: Config.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: Config.GOOGLE_AUTH_CALLBACK_PATH,
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async function(accessToken, refreshToken, profile, done) {
      try {
        const user = await UserModel.findOrCreate(profile);
        done(null, user);
      } catch(err) {
        console.log('Error creating new user: ', err);
        done(err, null);
      }
    }
  ));
};