import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateLikes, updateRetweets, updateFavorites } from '../actions/items';
import { Tweet } from 'react-twitter-widgets';
import { Button, Icon, Tooltip } from 'antd';
import '../css/OneTweet.css';

class OneTweet extends Component {
  render() {
    if(!this.props.tweetId || this.props.tweetId === ''){
      return (
        <div>
          <div id='onetweet-tweet' className='onetweet-tweet'></div>
        </div>
      );
    }
    else{
      let like = null;
      let retweet = null;
      let favorite = null;
      const onetweetStyle = `onetweet-tweet onetweet-tweet-${this.props.tweetId}`;
      if(!this.props.isAuthenticated){
        like = <Tooltip title="user login required"><Button disabled className="onetweet-button" icon="like-o">Like</Button></Tooltip>;
        retweet = <Tooltip title="user login required"><Button disabled className="onetweet-button" icon="retweet">Retweet</Button></Tooltip>;
        favorite = <Tooltip title="user login required"><Button disabled className="onetweet-button" icon="heart-o">Favorite</Button></Tooltip>;
      }
      else{
        if(this.props.likes.includes(this.props.tweetId)) {
          like = <Button onClick={() => {this.props.putUnlike(this.props.tweetId)}} className="onetweet-button"><Icon type="like" style={{ color: "#1890ff" }}/>Unlike</Button>;
        }
        else{
          like = <Button onClick={() => {this.props.putLike(this.props.tweetId)}} className="onetweet-button" icon="like-o">Like</Button>;
        }

        if(this.props.retweets.includes(this.props.tweetId)) {
          retweet = <Button onClick={() => {this.props.putUnretweet(this.props.tweetId)}} className="onetweet-button"><Icon type="retweet" style={{ color: "#52c41a" }}/>Unretweet</Button>;
        }
        else{
          retweet = <Button onClick={() => {this.props.putRetweet(this.props.tweetId)}} className="onetweet-button" icon="retweet">Retweet</Button>;
        }

        if(this.props.favorites.includes(this.props.tweetId)) {
          favorite = <Button onClick={() => {this.props.putUnfavorite(this.props.tweetId)}} className="onetweet-button"><Icon type="heart" style={{ color: "#f5222d" }}/>Unfavorite</Button>;
        }
        else{
          favorite = <Button onClick={() => {this.props.putFavorite(this.props.tweetId)}} className="onetweet-button" icon="heart-o">Favorite</Button>;
        }
      }

      return (
        <div className={onetweetStyle}>
          <div className="onetweet-buttons">
            {like}
            {retweet}
            {favorite}
          </div>
          <Tweet tweetId={this.props.tweetId}
            options={{
              align: 'left',
              width: '350'
            }}
            onLoad={()=> {
                const onetweets = document.getElementsByClassName(`onetweet-tweet-${this.props.tweetId}`);
                for(let i = 0; i < onetweets.length; i++){
                  const actions = onetweets[i].querySelector(`.twitter-tweet::shadow .Tweet-actions`);
                  if(actions){
                    actions.style.display = 'none'
                  }

                  const info = onetweets[i].querySelector(`.twitter-tweet::shadow .tweet-InformationCircle`);
                  if(info){
                    info.style.display = 'none'
                  }

                  const twitter = onetweets[i].querySelector(`.twitter-tweet::shadow > div`);
                  if(twitter){
                    twitter.style.cssText= 'position: static !important;';
                  }
                  const twitterContent = onetweets[i].querySelector(`.twitter-tweet::shadow > div > div`);
                  if(twitterContent){
                    twitterContent.style.cssText= 'border-radius: 0px 0px 4px 4px; position: static !important;';
                  }

                  if(this.props.type !== "favorite"){
                    const tweet = onetweets[i].querySelector(`.twitter-tweet`);
                    if(twitterContent){
                      let tweetHeight = window.getComputedStyle(tweet,null).getPropertyValue("height");
                      tweetHeight = tweetHeight.substring(0, tweetHeight.length - 2);
                      if(tweetHeight > 547.00){
                        onetweets[i].style.height = '600px';
                      }
                    }
                  }
                }    
              }
            }
          />
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.isAuthenticated,
    favorites: state.favorites,
    likes: state.likes,
    retweets: state.retweets
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    putLike: (id) => dispatch(updateLikes(id, true)),
    putUnlike: (id) => dispatch(updateLikes(id, false)),
    putRetweet: (id) => dispatch(updateRetweets(id, true)),
    putUnretweet: (id) => dispatch(updateRetweets(id, false)),
    putFavorite: (id) => dispatch(updateFavorites(id, true)),
    putUnfavorite: (id) => dispatch(updateFavorites(id, false))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OneTweet);
