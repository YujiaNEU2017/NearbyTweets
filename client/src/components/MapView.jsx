import React, { Component } from 'react';
//redux related
import { connect } from 'react-redux';
import { itemsFetchData } from '../actions/items';
//components
import Maps from './Maps';
import OneTweet from './OneTweet';
import '../css/MapView.css';

class MapView extends Component {
  render() {
    return (
      <div className="map-view">
        <Maps />
        <OneTweet tweetId={this.props.mapViewTwitterId} type="map"/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    mapViewTwitterId: state.mapViewTwitterId
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (coords) => dispatch(itemsFetchData(coords)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
