export function error(state = '', action) {
  switch (action.type) {
    case 'ERROR':
      return action.error;

    default:
      return state;
  }
}

export function isLocationLoading(state = false, action) {
  switch (action.type) {
    case 'IS_LOCATION_LOADING':
      return action.isLocationLoading;

    default:
      return state;
  }
}

export function isLoading(state = false, action) {
  switch (action.type) {
    case 'IS_LOADING':
      return action.isLoading;

    default:
      return state;
  }
}

export function items(state = [], action) {
  switch (action.type) {
    case 'ITEMS_FETCH_DATA_SUCCESS':
      return action.items;

    default:
      return state;
  }
}

export function radius(state = 1, action) {
  switch (action.type) {
    case 'CHANGE_RADIUS':
      return action.radius;

    default:
      return state;
  }
}

export function number(state = 10, action) {
  switch(action.type) {
    case 'CHANGE_NUMBER':
      return action.number;

    default:
      return state;
  }
}

export function tag(state = '', action) {
  switch(action.type) {
    case 'CHANGE_TAG':
      return action.tag;
    default:
      return state;
  }
}

export function location(state = {latitude: 47.622654, longitude: -122.337487}, action) {
  switch(action.type) {
    case 'CHANGE_LOCATION':
      return action.location;

    default:
      return state;
  }
}

export function isAuthenticated(state = false, action) {
  switch(action.type) {
    case 'CHANGE_AUTHENTICATED':
      return action.isAuthenticated;

    default:
      return state;
  }
}

export function username(state = 'Guest', action) {
  switch(action.type) {
    case 'CHANGE_USER_NAME':
      return action.username;

    default:
      return state;
  }
}

export function email(state = '', action) {
  switch(action.type) {
    case 'CHANGE_USER_EMAIL':
      return action.email;

    default:
      return state;
  }
}

export function avatar(state = '', action) {
  switch(action.type) {
    case 'CHANGE_USER_AVATAR':
      return action.avatar;

    default:
      return state;
  }
}

export function likes(state = [], action) {
  switch(action.type) {
    case 'CHANGE_LIKES':
      return action.likes;

    default:
      return state;
  }
}

export function retweets(state = [], action) {
  switch(action.type) {
    case 'CHANGE_RETWEETS':
      return action.retweets;

    default:
      return state;
  }
}

export function favorites(state = [], action) {
  switch(action.type) {
    case 'CHANGE_FAVORITES':
      return action.favorites;

    default:
      return state;
  }
}

export function listViewTwitterId(state = '', action) {
  switch(action.type) {
    case 'CHANGE_LIST_VIEW_TWITTER_ID':
      return action.listViewTwitterId;

    default:
      return state;
  }
}

export function mapViewTwitterId(state = '', action) {
  switch(action.type) {
    case 'CHANGE_MAP_VIEW_TWITTER_ID':
      return action.mapViewTwitterId;

    default:
      return state;
  }
}

export function city(state = '', action) {
  switch(action.type) {
    case 'CHANGE_CITY':
      return action.city;

    default:
      return state;
  }
}

export function region(state = '', action) {
  switch(action.type) {
    case 'CHANGE_REGION':
      return action.region;

    default:
      return state;
  }
}

export function sortOption(state = 'Newest', action) {
  switch(action.type) {
    case 'CHANGE_SORT_OPTION':
      return action.sortOption;

    default:
      return state;
  }
}
