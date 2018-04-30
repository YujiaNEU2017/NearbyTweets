import React, { Component } from 'react';
//redux related
import { connect } from 'react-redux';
import { changeListViewTwitterId, changeSortOption } from '../actions/items';
//components
import TweetLikeIcon from './TweetLikeIcon';
import TweetRetweetIcon from './TweetRetweetIcon';
import TweetFavoriteIcon from './TweetFavoriteIcon';
import OneTweet from './OneTweet';
import Description from './Description';
import OptionSelect from './OptionSelect';
import { List, Avatar } from 'antd';
import calculations from '../utils/calculations'
import '../css/ListView.css';


class ListView extends Component {

  constructor(props){
    super(props);
    this.state = {
      currentPage: 1,
      currentPageSize: 5
    };
  }

  generateListData(sortOption) {
    const listData = [];
    const { currentPage, currentPageSize } = this.state;
    const startIndex = (currentPage - 1) * currentPageSize;
    const tweets = this.props.tweets.slice();
    if(sortOption === 'Closest') {
      tweets.sort(this.compareDistance);
    }
    for (let i = startIndex; i < tweets.length ; i++) {
      if(i === startIndex + currentPageSize) break;
      const { created_at, coordinates, text, id_str, user } = tweets[i];
      listData.push({
        title: `${user.name}`,
        avatar: `${user.profile_image_url_https}`,
        description: <Description screenName={user.screen_name} createTime={created_at} tweetLocation={coordinates.coordinates} location={this.props.location} />,
        content: `${text.trim()}`,
        tweetId: `${id_str}`
      });
    }
    return listData;
  }

  compareDistance = (obj1, obj2) => {
    const [lat1, lon1] = obj1.coordinates.coordinates;
    const [lat2, lon2] = obj2.coordinates.coordinates;
    const {latitude, longitude} = this.props.location;
    return calculations.getDistanceFromLatLon(lat1, lon1, latitude, longitude) - calculations.getDistanceFromLatLon(lat2, lon2, latitude, longitude);
  }

  generatePagination(tweetsLength) {
    const pagination = {
      pageSize: this.state.currentPageSize,
      current: this.state.currentPage,
      total: tweetsLength,
      pageSizeOptions: ['5', '10', '20', '30'],
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      onChange: (currentPage, currentPageSize) => { this.onClickPagination(currentPage, currentPageSize); },
      onShowSizeChange: (currentPage, currentPageSize) => { this.onClickPagination(currentPage, currentPageSize); }
    };
    return pagination;
  }

  onClickPagination = (currentPage, currentPageSize) => {
    this.setState({
      currentPage,
      currentPageSize
    });
  };

  onChangeSortOption = (value) => {
    this.props.changeSortOption(value);
  };

  render() {
    const { tweets, sortOption, listViewTwitterId, displayTweet } = this.props;
    return (
      <div className="list-view">
        <OptionSelect option={['Newest', 'Closest']} onChange={this.onChangeSortOption} />
        <List
          className="list"
          size="large"
          pagination={this.generatePagination(tweets.length)}
          dataSource={this.generateListData(sortOption)}
          renderItem={item => (
            <List.Item
              key={item.title}
              actions={ [<TweetLikeIcon tweetId={item.tweetId}/>, <TweetRetweetIcon tweetId={item.tweetId}/>, <TweetFavoriteIcon tweetId={item.tweetId}/>] }
            >
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar}/>}
                  title={<a onClick={() => displayTweet(`${item.tweetId}`)}>{item.title}</a>}
                  description={<div onClick={() => displayTweet(`${item.tweetId}`)}>{item.description}</div>}
                />
                <div onClick={() => displayTweet(`${item.tweetId}`)}> {item.content}</div>
            </List.Item>
          )}
        />
        <OneTweet tweetId={listViewTwitterId} type="list" />
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    sortOption: state.sortOption,
    tweets: state.items,
    location: state.location,
    listViewTwitterId: state.listViewTwitterId
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    displayTweet: (id) => dispatch(changeListViewTwitterId(id)),
    changeSortOption: (sortOption) => dispatch(changeSortOption(sortOption))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListView);
