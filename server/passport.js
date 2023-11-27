const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');

const dotenv = require("dotenv");
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // Check if user already exists in your database
      const existingUser = await User.findOne({ email: profile.emails[0].value });

      if (existingUser) {
        return done(null, existingUser);
      }

      // If not, create a new user in your database
      const newUser = new User({
        email: profile.emails[0].value,
        username: profile.displayName,
      });

      const savedUser = await newUser.save();
      done(null, savedUser);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
