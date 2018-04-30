const services = {
  getData(coords) {
    return fetch(`/auth/user/data?lat=${coords.latitude}&lng=${coords.longitude}`, {
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'x-auth-token': localStorage.getItem('x-auth-token'),
        'content-type': 'application/json'
      },
      method: 'GET',
      mode: 'cors',
      redirect: 'follow',
      referrer: 'no-referrer',
      })
      .then(response => response.json())
      .catch( () => Promise.reject('server-error'));
  },
  saveSettings(settings) {
    return fetch('/auth/user/settings', {
      body: JSON.stringify(settings),
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'x-auth-token': localStorage.getItem('x-auth-token'),
        'content-type': 'application/json'
      },
      method: 'PUT',
      mode: 'cors',
      redirect: 'follow',
      referrer: 'no-referrer',
      })
      .then(response => response.json())
      .catch( () => Promise.reject('server-error'));
  },
  updateLikes(id, isLike) {
    return fetch('/auth/user/likes', {
      body: JSON.stringify({id, isLike}),
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'x-auth-token': localStorage.getItem('x-auth-token'),
        'content-type': 'application/json'
      },
      method: 'PUT',
      mode: 'cors',
      redirect: 'follow',
      referrer: 'no-referrer',
      })
      .then(response => response.json())
      .catch( () => Promise.reject('server-error'));
  },
  updateRetweets(id, isRetweet) {
    return fetch('/auth/user/retweets', {
      body: JSON.stringify({id, isRetweet}),
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'x-auth-token': localStorage.getItem('x-auth-token'),
        'content-type': 'application/json'
      },
      method: 'PUT',
      mode: 'cors',
      redirect: 'follow',
      referrer: 'no-referrer',
      })
      .then(response => response.json())
      .catch( () => Promise.reject('server-error'));
  },
  updateFavorites(id, isFavorite) {
    return fetch('/auth/user/favorites', {
      body: JSON.stringify({id, isFavorite}),
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'x-auth-token': localStorage.getItem('x-auth-token'),
        'content-type': 'application/json'
      },
      method: 'PUT',
      mode: 'cors',
      redirect: 'follow',
      referrer: 'no-referrer',
      })
      .then(response => response.json())
      .catch( () => Promise.reject('server-error'));
  },
  getCurrentLocationByIP() {
    return fetch('https://freegeoip.net/json/')
      .then(response => response.json())
      .catch(() => Promise.reject('server-error'));
  }
}

export default services;
