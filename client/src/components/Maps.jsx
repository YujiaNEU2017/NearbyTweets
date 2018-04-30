import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeMapViewTwitterId } from '../actions/items';
import '../css/Maps.css';

class Maps extends Component {
  constructor(props) {
    super(props);
    this.google = window.google;
  }

  componentDidMount() {
    this.map = this.generateBasicMaps();
    this.circle = this.generateCircleOnMaps();
    this.generateMarkersOnMaps();
  }

  componentDidUpdate() {
    this.clearMarkersOnMaps();
    this.clearCircleOnMaps();
    this.map = this.generateBasicMaps();
    this.circle = this.generateCircleOnMaps();
    this.generateMarkersOnMaps();
  }

  generateBasicMaps() {
    return new this.google.maps.Map(document.getElementById('map'), {
      zoom: this.getZoom(),
      center: this.getCenter(),
      disableDefaultUI: true
    });
  }

  generateCircleOnMaps() {
    return new this.google.maps.Circle({
      strokeColor: '#BFDFFF',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#BFDFFF',
      fillOpacity: 0.35,
      map: this.map,
      center: this.getCenter(),
      radius: this.getRadius()
    });
  }

  generateMarkersOnMaps() {
    this.markers = [];
    for (let i = 0; i < this.props.tweets.length; i++ ) {
      const tweetCenter = this.getGeocodeFromTweet(this.props.tweets[i]);
      const image = { url: this.props.tweets[i].user.profile_image_url_https };
      const marker = new this.google.maps.Marker({
        position: tweetCenter,
        icon: image,
        map: this.map,
        animation: this.google.maps.Animation.DROP
      });

      marker.addListener('click', () => {
        this.displayTweet(marker, this.props.tweets[i].id_str);
      });

      this.markers.push(marker);
    }
  }

  displayTweet(marker, tweetId) {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setAnimation(null);
    }
    this.props.displayTweet(tweetId);
    marker.setAnimation(this.google.maps.Animation.BOUNCE);
  }

  clearCircleOnMaps(){
    this.circle.setMap(null);
  }

  clearMarkersOnMaps() {
    if (this.markers) {
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
    }
  }

  getCenter() {
    if(this.props.location){
      return({
        lat: this.props.location.latitude,
        lng: this.props.location.longitude
      });
    }
    else{
      return {
        lat: 47.622654,
        lng: -122.337487
      };
    }
  }

  getZoom() {
    if(this.props.radius){
      switch (this.props.radius){
        case 1000: return 15;
        case 2000: return 14;
        case 4000: return 13;
        default: return 14;
      }
    }
    else{
      return 15;
    }
  }

  getRadius() {
    if(this.props.radius){
      return this.props.radius;
    }
    else{
      return 1000;
    }
  }

  getGeocodeFromTweet(tweet) {
    return { lat: tweet.coordinates.coordinates[0], lng: tweet.coordinates.coordinates[1] };
  }

  render() {
    return (
      <div id="map"></div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tweets: state.items,
    radius: state.radius * 1000,
    location: state.location
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    displayTweet: (id) => dispatch(changeMapViewTwitterId(id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Maps);
