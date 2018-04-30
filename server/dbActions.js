const User = require('mongoose').model('User');

module.exports = {
  dbUpdateLikes: async (userId, likes) => {
    User.updateTwitterUserLikes(userId, likes, (err, user) => {
      if (err) {
        console.log(err);
        return false;
      }
      return true;
    });
  },
  dbUpdateRetweets: async (userId, retweets) => {
    User.updateTwitterUserRetweets(userId, retweets, (err, user) => {
      if (err) {
        console.log(err);
        return false;
      }
      return true;
    });
  },
  dbUpdateFavorites: async (userId, favorites) => {
    User.updateTwitterUserFavorites(userId, favorites, (err, user) => {
      if (err) {
        console.log(err);
        return false;
      }
      return true;
    });
  }
};

