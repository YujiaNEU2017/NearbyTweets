const buildRequest = (id, isAdd, ids, key) => {
  const request = {};
  if (isAdd) {
    if (!ids.includes(id)) {
      ids.push(id);
      request[key] = ids;
      request.isNeedUpdate = true;
    }
    else{
      request.isNeedUpdate = false;
    }
  }
  else{
    const index = ids.indexOf(id);
    if (index > -1) {
      ids.splice(index, 1);
      request[key] = ids;
      request.isNeedUpdate = true;
    }
    else{
      request.isNeedUpdate = false;
    }
  }
  return request;
}

module.exports = {
  buildRequestLikes: (id, isLike, likes) => {
    const request =  buildRequest(id, isLike, likes, 'likes');
    if (isLike) {
      request.url = 'https://api.twitter.com/1.1/favorites/create.json?id=';
    }
    else{
      request.url = 'https://api.twitter.com/1.1/favorites/destroy.json?id=';
    }
    return request;
  },
  buildRequestRetweets: (id, isRetweet, retweets) => {
    const request =  buildRequest(id, isRetweet, retweets, 'retweets');
    if (isRetweet) {
      request.url = 'https://api.twitter.com/1.1/statuses/retweet/';
    }
    else{
      request.url = 'https://api.twitter.com/1.1/statuses/unretweet/';
    }
    return request;
  },
  buildRequestFavorites: (id, isFavorite, favorites) => {
    return buildRequest(id, isFavorite, favorites, 'favorites');
  }
};

