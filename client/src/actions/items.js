import React from 'react';
import services from '../utils/services';
import { message, notification, Icon } from 'antd';


export function changeError(error) {
  return {
    type: 'ERROR',
    error
  };
}

export function isLocationLoading(bool) {
  return {
    type: 'IS_LOCATION_LOADING',
    isLocationLoading: bool
  };
}

export function isLoading(bool) {
  return {
    type: 'IS_LOADING',
    isLoading: bool
  };
}

export function itemsFetchDataSuccess(items) {
  return {
    type: 'ITEMS_FETCH_DATA_SUCCESS',
    items
  };
}

export function changeRadius(radius) {
  return {
    type: 'CHANGE_RADIUS',
    radius
  };
}

export function changeNumberOfItems(number) {
  return {
    type: 'CHANGE_NUMBER',
    number
  };
}

export function changeTag(tag) {
  return {
    type: 'CHANGE_TAG',
    tag
  };
}

export function changeLocation(location) {
  return {
    type: 'CHANGE_LOCATION',
    location
  };
}

export function changeAuthenticated(isAuthenticated) {
  return {
    type: 'CHANGE_AUTHENTICATED',
    isAuthenticated
  };
}

export function changeUserName(username) {
  return {
    type: 'CHANGE_USER_NAME',
    username
  };
}

export function changeUserEmail(email) {
  return {
    type: 'CHANGE_USER_EMAIL',
    email
  };
}

export function changeUserAvatar(avatar) {
  return {
    type: 'CHANGE_USER_AVATAR',
    avatar
  };
}

export function changeLikes(likes) {
  return {
    type: 'CHANGE_LIKES',
    likes
  };
}

export function changeRetweets(retweets) {
  return {
    type: 'CHANGE_RETWEETS',
    retweets
  };
}

export function changeFavorites(favorites) {
  return {
    type: 'CHANGE_FAVORITES',
    favorites
  };
}

export function changeListViewTwitterId(listViewTwitterId) {
  return {
    type: 'CHANGE_LIST_VIEW_TWITTER_ID',
    listViewTwitterId
  };
}

export function changeMapViewTwitterId(mapViewTwitterId) {
  return {
    type: 'CHANGE_MAP_VIEW_TWITTER_ID',
    mapViewTwitterId
  };
}

export function changeCity(city) {
  return {
    type: 'CHANGE_CITY',
    city
  };
}

export function changeRegion(region) {
  return {
    type: 'CHANGE_REGION',
    region
  };
}

export function changeSortOption(sortOption) {
  return {
    type: 'CHANGE_SORT_OPTION',
    sortOption
  };
}

function setUserLogin(dispatch, user) {
  dispatch(changeUserName(user.userName));
  dispatch(changeUserEmail(user.email));
  dispatch(changeUserAvatar(user.userImage));
  dispatch(changeRadius(user.settings.radius));
  dispatch(changeNumberOfItems(user.settings.number));
  dispatch(changeTag(user.settings.tag));
  dispatch(changeLikes(user.likes));
  dispatch(changeRetweets(user.retweets));
  dispatch(changeFavorites(user.favorites));
  dispatch(changeAuthenticated(true));
}

function setUserLogout(dispatch) {
  dispatch(changeAuthenticated(false));
  dispatch(changeUserName('Guest'));
  dispatch(changeRadius(1));
  dispatch(changeNumberOfItems(10));
  dispatch(changeTag(''));
  dispatch(changeLikes([]));
  dispatch(changeRetweets([]));
  dispatch(changeFavorites([]));
}

function sendNotificationOnLocationSuccess(location) {
  notification.open({
    message: 'Get Location Success',
    description: `Location: ${location.city}, ${location.region_code}`,
    icon: <Icon type="global" style={{ color: "#52c41a" }} />,
    duration: 6
  });
}

function sendNotificationOnFetchDataSuccess(dataLength) {
  notification.open({
    message: 'Fetch Nearby Tweets Success',
    description: `${dataLength} tweets nearby in total`,
    icon: <Icon type="twitter" style={{ color: "#1890ff" }} />,
    duration: 6
  });
}

function sendNotificationOnLoginSuccess(user) {
  notification['success']({
    message: 'Login Success',
    description: `Login as: @${user.userName}`,
    duration: 4.5
  });
}

function sendNotificationOnLogoutSuccess() {
  notification['success']({
    message: 'Logout Success',
    description: 'Welcome back, see you soon!',
    duration: 4.5
  });
}

function sendNotification(typeIndex, bool) {
  const messageType = [['Like Tweet Success', 'Unlike Tweet Success'], ['Retweet Tweet Success', 'Un-retweet Tweet Success'], ['Favorite Tweet Success', 'Un-favorite Tweet Success']];
  const iconType = [['like', 'like-o'], ['retweet', 'retweet'], ['heart', 'heart-o']];
  const colorType = [['#1890ff', ''], ['#52c41a', ''], ['#f5222d', '']];
  const message = bool ? messageType[typeIndex][0] : messageType[typeIndex][1];
  const icon = bool ? iconType[typeIndex][0] : iconType[typeIndex][1];
  const color = bool ? colorType[typeIndex][0] : colorType[typeIndex][1];
  notification.open({
    message: message,
    description: '',
    icon: <Icon type={icon} style={{ color: `${color}` }} />,
    duration: 3.5
  });
}

// Async actions
export function getCurrentLocation() {
  return (dispatch) => {
    dispatch(isLocationLoading(true));
    if (navigator.geolocation) {
      const options = { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 };
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch(isLocationLoading(false));
          dispatch(changeLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          dispatch(itemsFetchData(position.coords));
          dispatch(getCity());
        },
        (err) => {
          dispatch(isLocationLoading(false));
          dispatch(getCurrentLocationByIP()); // if cannot get location info from browser, try to get it by IP
          console.warn(err.message, 'Unable to get current location from browser, trying to get location from IP, please wait...');
        },
        options
      );
    }
    else {
      dispatch(isLocationLoading(false));
      dispatch(getCurrentLocationByIP()); // if cannot get location info from browser, try to get it by IP
      console.warn('Geolocation is not supported by your browser, trying to get location from IP, please wait...');
    }
  };
}

export function itemsFetchData(coords) {
  return (dispatch) => {
    dispatch(isLoading(true));
    services.getData(coords)
    .then(res => {
      dispatch(isLoading(false));
      if (!res.error) {
        dispatch(changeError(''));
        dispatch(itemsFetchDataSuccess(res.tweets));
        sendNotificationOnFetchDataSuccess(res.tweets.length);
      }
      else{
        dispatch(changeError(res.error));
      }

      if (res.user){
        setUserLogin(dispatch, res.user);
      }
      else{
        setUserLogout(dispatch);
      }
    })
    .catch( error => {
      dispatch(isLoading(false));
      dispatch(changeError(error));
    });
  };
}

export function saveSettings(settings, location) {
  return (dispatch) => {
    dispatch(isLoading(true));
    message.loading('Action in progress..', 0);
    services.saveSettings(settings)
    .then( res => {
      dispatch(isLoading(false));
      message.destroy();
      if(!res.error) {
        dispatch(changeError(''));
        dispatch(changeRadius(res.user.settings.radius));
        dispatch(changeNumberOfItems(res.user.settings.number));
        dispatch(changeTag(res.user.settings.tag));
        message.success('Settings saved', 2);
        dispatch(itemsFetchData(location));
      }
      else{
        dispatch(changeError(res.error));
      }
      if (res.user){
        setUserLogin(dispatch, res.user);
      }
      else{
        setUserLogout(dispatch);
      }
    })
    .catch( error => {
      dispatch(isLoading(false));
      dispatch(changeError(error));
    });
  };
}

export function onLoginSuccess(response) {
  return (dispatch) => {
    dispatch(isLoading(true));
    const token = response.headers.get('x-auth-token');
    response.json().then(user => {
      if (token) {
        dispatch(isLoading(false));
        dispatch(changeError(''));
        localStorage.setItem('x-auth-token', token);
        setUserLogin(dispatch, user);
        sendNotificationOnLoginSuccess(user);
      }
      else{
        dispatch(isLoading(false));
        dispatch(changeError('login-user-error'));
      }
    });
  };
}

export function onLogoutSuccess(response) {
  return (dispatch) => {
    setUserLogout(dispatch);
    sendNotificationOnLogoutSuccess();
  };
}

export function updateLikes(id, isLike) {
  return (dispatch) => {
    dispatch(isLoading(true));
    message.loading('Action in progress..', 0);
    services.updateLikes(id, isLike)
    .then( res => {
      dispatch(isLoading(false));
      message.destroy();
      if(!res.error) {
        dispatch(changeError(''));
        dispatch(changeLikes(res.user.likes));
        sendNotification(0, isLike);
      }
      else{
        dispatch(changeError(res.error));
      }
      if (res.user){
        setUserLogin(dispatch, res.user);
      }
      else{
        setUserLogout(dispatch);
      }
    })
    .catch( error => {
      dispatch(isLoading(false));
      dispatch(changeError(error));
    });
  };
}

export function updateRetweets(id, isRetweet) {
  return (dispatch) => {
    dispatch(isLoading(true));
    message.loading('Action in progress..', 0);
    services.updateRetweets(id, isRetweet)
    .then( res => {
      dispatch(isLoading(false));
      message.destroy();
      if(!res.error) {
        dispatch(changeError(''));
        dispatch(changeRetweets(res.user.retweets));
        sendNotification(1, isRetweet);
      }
      else{
        dispatch(changeError(res.error));
      }
      if (res.user){
        setUserLogin(dispatch, res.user);
      }
      else{
        setUserLogout(dispatch);
      }
    })
    .catch( error => {
      dispatch(isLoading(false));
      dispatch(changeError(error));
    });
  };
}

export function updateFavorites(id, isFavorite) {
  return (dispatch) => {
    dispatch(isLoading(true));
    message.loading('Action in progress..', 0);
    services.updateFavorites(id, isFavorite)
    .then( res => {
      dispatch(isLoading(false));
      message.destroy();
      if(!res.error) {
        dispatch(changeError(''));
        dispatch(changeFavorites(res.user.favorites));
        sendNotification(2, isFavorite);
      }
      else{
        dispatch(changeError(res.error));
      }
      if (res.user){
        setUserLogin(dispatch, res.user);
      }
      else{
        setUserLogout(dispatch);
      }
    })
    .catch( error => {
      dispatch(isLoading(false));
      dispatch(changeError(error));
    });
  };
}

export function getCurrentLocationByIP() {
  return (dispatch) => {
    dispatch(isLocationLoading(true));
    services.getCurrentLocationByIP()
    .then( location => {
      dispatch(isLocationLoading(false));
      dispatch(changeLocation({
        latitude: location.latitude,
        longitude: location.longitude
      }));
      dispatch(changeCity(location.city));
      dispatch(changeRegion(location.region_code));
      sendNotificationOnLocationSuccess(location);
      dispatch(itemsFetchData(location));
    })
    .catch( error => {
      dispatch(isLocationLoading(false));
      dispatch(changeError(error));
    });
  };
}

export function getCity() {
  return (dispatch) => {
    services.getCurrentLocationByIP()
    .then( location => {
      dispatch(changeCity(location.city));
      dispatch(changeRegion(location.region_code));
      sendNotificationOnLocationSuccess(location);
    })
    .catch( error => {
      dispatch(changeError(error));
    });
  };
}
