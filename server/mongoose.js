const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = () => {

  const db = mongoose.connect('mongodb://sapphire:sapphire@ds237379.mlab.com:37379/heroku_9nvm5pxf');

  const UserSchema = new Schema({
    email: {
      type: String, required: true,
      trim: true, unique: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    userName: String,
    userImage: String,
    twitterProvider: {
      type: {
        id: String,
        token: String,
        tokenSecret: String
      }
    },
    settings: {
      type: {
        radius: Number,
        tag: String,
        number: Number
      }
    },
    favorites: [String],
    likes: [String],
    retweets: [String]
  });

  UserSchema.set('toJSON', {getters: true, virtuals: true});

  UserSchema.statics.upsertTwitterUser = function(token, tokenSecret, profile, cb) {
    const that = this;
    return this.findOne({
      'twitterProvider.id': profile.id
    }, (err, user) => {
      if (!user) {
        const newUser = new that({
          email: profile.emails[0].value,
          userName: profile.displayName,
          userImage: profile._json.profile_image_url_https,
          twitterProvider: {
            id: profile.id,
            token: token,
            tokenSecret: tokenSecret
          },
          settings: {
            radius: 1,
            tag: '',
            number: 10
          },
          favorites: [],
          likes: [],
          retweets: []
        });

        newUser.save((error, savedUser) => {
          if (error) {
            console.log(error);
          }
          return cb(error, savedUser);
        });
      } else {
        return cb(err, user);
      }
    });
  };

  UserSchema.statics.updateTwitterUserSettings = function(id, settings, cb) {
    const that = this;
    return this.findOneAndUpdate({
      'twitterProvider.id': id
    }, {$set:{settings: settings}}, {new: true}, (err, doc) => {
      if (err) {
        console.log(err);
      }
      return cb(err, doc);
    });
  };

  UserSchema.statics.updateTwitterUserFavorites = function(id, favorites, cb) {
    const that = this;
    return this.findOneAndUpdate({
      'twitterProvider.id': id
    }, {$set:{favorites: favorites}}, {new: true}, (err, doc) => {
      if (err) {
        console.log(err);
      }
      return cb(err, doc);
    });
  };

  UserSchema.statics.updateTwitterUserLikes = function(id, likes, cb) {
    const that = this;
    return this.findOneAndUpdate({
      'twitterProvider.id': id
    }, {$set:{likes: likes}}, {new: true}, (err, doc) => {
      if (err) {
        console.log(err);
      }
      return cb(err, doc);
    });
  };

  UserSchema.statics.updateTwitterUserRetweets = function(id, retweets, cb) {
    const that = this;
    return this.findOneAndUpdate({
      'twitterProvider.id': id
    }, {$set:{retweets: retweets}}, {new: true}, (err, doc) => {
      if (err) {
        console.log(err);
      }
      return cb(err, doc);
    });
  };

  mongoose.model('User', UserSchema);

  return db;
};
