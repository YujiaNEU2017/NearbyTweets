const passport = require('passport');
const TwitterTokenStrategy = require('passport-twitter-token');
const User = require('mongoose').model('User');
const twitterConfig = process.env.PORT ? require('./twitterConfigHeroku') : require('./twitterConfigTest');

module.exports = () => {
  passport.use(new TwitterTokenStrategy({
      consumerKey: twitterConfig.consumerKey,
      consumerSecret: twitterConfig.consumerSecret,
      includeEmail: true
    }, (token, tokenSecret, profile, done) => {
      User.upsertTwitterUser(token, tokenSecret, profile, (err, user) => {
        return done(err, user);
      });
    }
  ));
};