import React, { Component } from 'react';
//redux related
import { connect } from 'react-redux';
import { updateLikes } from '../actions/items';

import { Icon, Tooltip } from 'antd';

//import '../css/TweetLikeIcon.css';


class TweetLikeIcon extends Component {

  render() {
    if(!this.props.isAuthenticated){
      return (
        <span>
          <Tooltip title="user login required">
            <Icon type="like-o" style={{ marginRight: 8 }}/>
          </Tooltip>
        </span>
      );
    }
    else if(this.props.likes.includes(this.props.tweetId)) {
      return (
        <span>
          <Icon type="like" style={{ marginRight: 8, color: "#1890ff" }} onClick={ () => {this.props.putUnlike(this.props.tweetId)} }/>
        </span>
      );
    }
    else{
      return(
        <span>
          <Icon type="like-o" style={{ marginRight: 8 }} onClick={ () => {this.props.putLike(this.props.tweetId)} }/>
        </span>
      );
    }

  }
}


const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.isAuthenticated,
    likes: state.likes
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    putLike: (id) => dispatch(updateLikes(id, true)),
    putUnlike: (id) => dispatch(updateLikes(id, false))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TweetLikeIcon);
