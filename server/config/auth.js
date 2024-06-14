import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import userModel from './models/user'; // Adjust the path as necessary

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await userModel.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = new userModel({
        username: profile.displayName,
        email: profile.emails[0].value,
        mobile: '', // You can set a default or prompt the user later
        password: '', // No password since this is OAuth
        isVerified: true
      });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await userModel.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = new userModel({
        username: profile.displayName,
        email: profile.emails[0].value,
        mobile: '', // You can set a default or prompt the user later
        password: '', // No password since this is OAuth
        isVerified: true
      });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
