import React from 'react';
import { Icon } from 'antd';
import calculations from '../utils/calculations';

const Description = ({ screenName, createTime, tweetLocation, location }) => {
  const [tLat, tLon] = tweetLocation;
  const { latitude, longitude } = location;

  return(
    <div>
      <div>@{screenName} <Icon type="environment" /> {calculations.getDistanceFromLatLon(tLat, tLon, latitude, longitude)} km</div>
      <div><Icon type="clock-circle-o"/> {calculations.parseTweetDate(createTime)}</div>
    </div>
  );
};

export default Description;
