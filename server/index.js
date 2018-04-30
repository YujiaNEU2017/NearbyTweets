const mongoose = require('./mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const request = require('request');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const cors = require('cors')
const PORT = process.env.PORT || 8000;
const twitterConfig = process.env.PORT ? require('./twitterConfigHeroku') : require('./twitterConfigTest');
const getCoordinates = require('./coordinatesGenerator');
const userActions = require('./userActions');
const app = express();
mongoose();
const User = require('mongoose').model('User');
const dbActions = require('./dbActions');

//configuring cors
const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

//configuring bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.resolve(__dirname, '../client/build')));

//guest twitter guest api init
const Twitter = require('twitter');
const client = new Twitter({
  consumer_key: twitterConfig.consumerKey,
  consumer_secret: twitterConfig.consumerSecret,
  access_token_key: twitterConfig.guestTokenKey,
  access_token_secret: twitterConfig.guestTokenSecret
});

//passport-twitter
const passportConfig = require('./passport');
passportConfig();

app.post('/auth/twitter/reverse', (req, res) => {
  request.post({
    url: 'https://api.twitter.com/oauth/request_token',
    oauth: {
      oauth_callback: twitterConfig.callbackUrl,
      consumer_key: twitterConfig.consumerKey,
      consumer_secret: twitterConfig.consumerSecret
    }
  }, (err, r, body) => {
    if (err) {
      return res.send({ error: err.message });
    }

    if (body.indexOf('oauth') !== 0) {
      return res.send({ error: 'login-user-error' });
    }

    const jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
    res.send(JSON.parse(jsonStr));
  });
});

const createToken = (auth) => {
  return jwt.sign({
    id: auth.id
  }, 'sapphire',
  {
    expiresIn: 60 * 60 * 24
  });
};

const generateToken = (req, res, next) => {
  req.token = createToken(req.auth);
  return next();
};

const sendToken = (req, res) => {
  res.setHeader('x-auth-token', req.token);
  return res.send(JSON.stringify(req.user));
};

app.post('/auth/twitter', (req, res, next) => {
    request.post({
      url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
      oauth: {
        consumer_key: twitterConfig.consumerKey,
        consumer_secret: twitterConfig.consumerSecret,
        token: req.query.oauth_token
      },
      form: { oauth_verifier: req.query.oauth_verifier }
    }, (err, r, body) => {
      if (err) {
        return res.send({ error: "login-user-error" });
      }

      const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      const parsedBody = JSON.parse(bodyString);

      req.body['oauth_token'] = parsedBody.oauth_token;
      req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
      req.body['user_id'] = parsedBody.user_id;
      next();
    });
  },
  passport.authenticate('twitter-token', {session: false}),
  (req, res, next) => {
    if (!req.user) {
      return res.send({ error: 'login-user-error'});
    }

    req.auth = {
      id: req.user.id
    };

    req.user = req.user.toObject();

    delete req.user['twitterProvider'];
    delete req.user['__v'];
    delete req.user['_id'];

    return next();
  },
  generateToken,
  sendToken
);

//token handling middleware
const authenticate = expressJwt({
  secret: 'sapphire',
  requestProperty: 'auth',
  getToken: (req) => {
    if (req.headers['x-auth-token']) {
      return req.headers['x-auth-token'];
    }
    return null;
  }
});

const handTokenError = (err, req, res, next) => {
  req.error = "auth-user-error";
  next();
};

const getUser = (req, res, next) => {
  if (req.error) {
    return next();
  }

  User.findById(req.auth.id, (err, user) => {
    if (err) {
      req.error = "database-user-error";
      next();
    }
    else {
      req.user = user;
      next();
    }
  });
};

const setUser = (req, res, next) => {
  if (req.error) {
    return next();
  }

  if (req.user) {
    req.user = req.user.toObject();
    delete req.user['_id'];
    delete req.user['__v'];
  }

  next();
};

app.use('/auth/user',authenticate);
app.use('/auth/user',handTokenError);
app.use('/auth/user',getUser);
app.use('/auth/user',setUser);

app.get('/auth/user/data', (req, res) => {
  const resTweets = [];
  const params = twitterConfig.params;
  const currCoordinates = twitterConfig.defaultCoordinates;
  let currRadius = twitterConfig.defaultRadius;
  if(req.query.lat && req.query.lng){
    params.geocode = `${req.query.lat},${req.query.lng},`;
    currCoordinates[0] = parseFloat(req.query.lat);
    currCoordinates[1] = parseFloat(req.query.lng);
  }
  if (req.user) {
    params.q = '#' + req.user.settings.tag;
    params.count = req.user.settings.number.toString();
    params.geocode += req.user.settings.radius + 'km';
    currRadius = req.user.settings.radius;
    delete req.user['twitterProvider'];
  }
  else{
    params.geocode += '1km';
  }

  client.get('https://api.twitter.com/1.1/search/tweets.json', params)
  .then(tweets => {
    if (tweets) {
      for (let i = 0; i < tweets.statuses.length; i++) {
        resTweets[i] = tweets.statuses[i];
        resTweets[i].coordinates = {
          coordinates: getCoordinates(currRadius, currCoordinates)
        };
      }
      res.json({tweets : resTweets, user: req.user});
    }
    else{
      res.json({error : "twitter-error", user: req.user});
    }
  })
  .catch(e => {
    res.json({error : "twitter-error", user: req.user});
  });
});

const checkSettings = (settings) => {
  if (settings && settings.radius && settings.number) {
    if(!settings.radius === 1 && !settings.radius === 2 && !settings.radius === 4){
      return false;
    }
    if (!settings.number === 10 && !settings.number === 20 && !settings.number === 30) {
      return false;
    }
    return true;
  }
  else{
    return false;
  }
}

app.put('/auth/user/settings', (req, res) => {
  if (checkSettings(req.body) && req.user) {
    const userId = req.user.twitterProvider.id;
    delete req.user['twitterProvider'];
    User.updateTwitterUserSettings(userId, req.body, (err, user) => {
      if (err) {
        return res.json({error : "database-error", user: req.user});
      }
      req.user.settings = req.body;
      res.json({user: req.user});
    });
  }
  else{
    if (req.user) {
      delete req.user['twitterProvider'];
    }
    res.json({error : "auth-user-error", user: req.user});
  }
});

app.put('/auth/user/likes', (req, res) => {
  if (req.body.id && req.body.isLike != undefined && req.user) {
    const requestLikes = userActions.buildRequestLikes(req.body.id, req.body.isLike, req.user.likes.slice());
    const currClient = new Twitter({
      consumer_key: twitterConfig.consumerKey,
      consumer_secret: twitterConfig.consumerSecret,
      access_token_key: req.user.twitterProvider.token,
      access_token_secret: req.user.twitterProvider.tokenSecret
    });
    const userId = req.user.twitterProvider.id;
    delete req.user['twitterProvider'];
    currClient.post(requestLikes.url + req.body.id, {})
    .then(response => {
      if (requestLikes.isNeedUpdate) {
        if (!dbActions.dbUpdateLikes(userId, requestLikes.likes)){
          return res.json({error : "database-error", user: req.user});
        }
        req.user.likes = requestLikes.likes;
      }
      return res.json({user: req.user});
    })
    .catch(e => {
      if (e[0].code === 139 || e[0].code === 144) {
        if (requestLikes.isNeedUpdate) {
          if (!dbActions.dbUpdateLikes(userId, requestLikes.likes)){
            return res.json({error : "database-error", user: req.user});
          }
          req.user.likes = requestLikes.likes;
        }
        return res.json({user: req.user});
      }
      console.log(e);
      return res.json({error : "twitter-error", user: req.user});
    });
  }
  else{
    if (req.user) {
      delete req.user['twitterProvider'];
    }
    res.json({error : "auth-user-error", user: req.user});
  }
});

app.put('/auth/user/retweets', (req, res) => {
  if (req.body.id && req.body.isRetweet != undefined && req.user) {
    const requestRetweets = userActions.buildRequestRetweets(req.body.id, req.body.isRetweet, req.user.retweets.slice());
    const currClient = new Twitter({
      consumer_key: twitterConfig.consumerKey,
      consumer_secret: twitterConfig.consumerSecret,
      access_token_key: req.user.twitterProvider.token,
      access_token_secret: req.user.twitterProvider.tokenSecret
    });
    const userId = req.user.twitterProvider.id;
    delete req.user['twitterProvider'];
    currClient.post(requestRetweets.url + req.body.id + '.json', {})
    .then(response => {
      if (requestRetweets.isNeedUpdate) {
        if (!dbActions.dbUpdateRetweets(userId, requestRetweets.retweets)){
          return res.json({error : "database-error", user: req.user});
        }
        req.user.retweets = requestRetweets.retweets;
      }
      return res.json({user: req.user});
    })
    .catch(e => {
      if (e[0].code === 327) {
        if (requestRetweets.isNeedUpdate) {
          if (!dbActions.dbUpdateRetweets(userId, requestRetweets.retweets)){
            return res.json({error : "database-error", user: req.user});
          }
          req.user.retweets = requestRetweets.retweets;
        }
        return res.json({user: req.user});
      }
      console.log(e);
      return res.json({error : "twitter-error", user: req.user});
    });
  }
  else{
    if (req.user) {
      delete req.user['twitterProvider'];
    }
    res.json({error : "auth-user-error", user: req.user});
  }
});

app.put('/auth/user/favorites', (req, res) => {
  if (req.body.id && req.body.isFavorite != undefined && req.user) {
    const requestFavorites = userActions.buildRequestFavorites(req.body.id, req.body.isFavorite, req.user.favorites.slice());
    const userId = req.user.twitterProvider.id;
    delete req.user['twitterProvider'];
    if (requestFavorites.isNeedUpdate) {
      if (!dbActions.dbUpdateFavorites(userId, requestFavorites.favorites)){
        return res.json({error : "database-error", user: req.user});
      }
      req.user.favorites = requestFavorites.favorites;
    }
    return res.json({user: req.user});
  }
  else{
    if (req.user) {
      delete req.user['twitterProvider'];
    }
    res.json({error : "auth-user-error", user: req.user});
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
