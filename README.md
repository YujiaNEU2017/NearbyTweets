# Nearby Tweets (project-nearbytweets)
## Overview
This Web App is a location-based nearby tweets finder.<br>
Users can **browse detail/like/retweet/favorite** their nearby tweets with corresponding **user settings**.<br>
Heroku link: [https://project-nearbytweets.herokuapp.com](https://project-nearbytweets.herokuapp.com)

## User Manual
This App is consisted of 4 primary Tab pages:<br>
1. **List**: <br>
List view of nearby tweets
- sort by time/distance
- click list item to show tweet details
- like/retweet/favorite tweets (login required)
2. **Nearby**: <br>
Map view of nearby tweets
- click marker on the map to show tweet details
- like/retweet/favorite tweets (login required)
3. **Favorites**: <br>
User favorite tweets
- like/retweet/favorite tweets (login required)
4. **Settings**: <br>
User settings
- change radius range(km), maximum number of tweets, tag(#) (login required)

## Technologies
1. **Frontend** - React
- The application mainly uses **Ant Design** for decorating UI components
- The **Redux** is applied to manage the state of the application, and the **Redux Thunk** is for performing asynchornized dispatch
- The **Google Map API** is used to demonstrate nearby tweets on map view
- The user **Token** passed from server is stored on **Local Storage**

2. **Backend** - NodeJS Express
- The application implements user authentication with **OAuth (Twitter)**
- The **Passport** is used for OAuth authentication and retrieving user profile from Twitter
- The user data is stored on **MongoDB**
- The **JWT(JSON Web Token)** is used for generating user token and carrying out user authentication on server side
