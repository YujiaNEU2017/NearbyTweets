import React, { Component } from 'react';
//redux related
import { connect } from 'react-redux';
import { updateRetweets } from '../actions/items';

import { Icon, Tooltip } from 'antd';

//import '../css/TweetRetweetIcon.css';


class TweetRetweetIcon extends Component {

  render() {
    if(!this.props.isAuthenticated){
      return (
        <span>
          <Tooltip title="user login required">
            <Icon type="retweet" style={{ marginRight: 8 }}/>
          </Tooltip>
        </span>
      );
    }
    else if(this.props.retweets.includes(this.props.tweetId)) {
      return (
        <span>
          <Icon type="retweet" style={{ marginRight: 8, color: "#52c41a" }} onClick={ () => {this.props.putUnretweet(this.props.tweetId)} }/>
        </span>
      );
    }
    else{
      return(
        <span>
          <Icon type="retweet" style={{ marginRight: 8 }} onClick={ () => {this.props.putRetweet(this.props.tweetId)} }/>
        </span>
      );
    }

  }
}


const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.isAuthenticated,
    retweets: state.retweets
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    putRetweet: (id) => dispatch(updateRetweets(id, true)),
    putUnretweet: (id) => dispatch(updateRetweets(id, false))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TweetRetweetIcon);
