import React, { Component } from 'react';
//redux related
import { connect } from 'react-redux';
import { updateFavorites } from '../actions/items';

import { Icon, Tooltip } from 'antd';

//import '../css/TweetFavoriteIcon.css';


class TweetFavoriteIcon extends Component {

  render() {
    if(!this.props.isAuthenticated){
      return (
        <span>
          <Tooltip title="user login required">
            <Icon type="heart-o" style={{ marginRight: 8 }}/>
          </Tooltip>
        </span>
      );
    }
    else if(this.props.favorites.includes(this.props.tweetId)) {
      return (
        <span>
          <Icon type="heart" style={{ marginRight: 8, color: "#f5222d" }} onClick={ () => {this.props.putUnfavorite(this.props.tweetId)} }/>
        </span>
      );
    }
    else{
      return(
        <span>
          <Icon type="heart-o" style={{ marginRight: 8 }} onClick={ () => {this.props.putFavorite(this.props.tweetId)} }/>
        </span>
      );
    }
  }
}


const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.isAuthenticated,
    favorites: state.favorites
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    putFavorite: (id) => dispatch(updateFavorites(id, true)),
    putUnfavorite: (id) => dispatch(updateFavorites(id, false))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TweetFavoriteIcon);
