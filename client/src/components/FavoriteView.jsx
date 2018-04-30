import React, { Component } from 'react';
import { connect } from 'react-redux';
import OneTweet from './OneTweet'
import { Pagination, Alert } from 'antd'
import '../css/FavoriteView.css';

class FavoriteView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      currentPageSize: 5
    };
  }

  generateTweetList () {
    const listData = [];
    const { currentPage, currentPageSize } = this.state;
    const startIndex = (currentPage - 1) * currentPageSize;
    for (let i = startIndex; i < this.props.favorites.length ; i++) {
      if(i === startIndex + currentPageSize) break;
      listData.push( <OneTweet key={this.props.favorites[i]} tweetId={this.props.favorites[i]} type="favorite"/> );
    }
    return listData;
  }

  onClickPagination = (currentPage, currentPageSize) => {
    this.setState({
      currentPage,
      currentPageSize
    });
  };

  render() {
    this.tweetList = this.generateTweetList();
    if(!this.props.isAuthenticated) {
      return (
        <div className='favorite-view-alert'>
          <Alert
            message="User Login Required"
            description="Please go to Login Bar or Settings to login."
            type="info"
            iconType="user"
            showIcon
          />
        </div>
      );
    }
    return (
      <div className='favorite-view'>
        <div className="favorite-list">{this.tweetList}</div>
        <div className="favorite-list-pagination">
          <Pagination
            current={this.state.currentPage}
            total={this.props.favorites.length}
            pageSizeOptions={['5', '10', '20']}
            showSizeChanger={true}
            showQuickJumper={true}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            pageSize={this.state.currentPageSize}
            onChange={this.onClickPagination}
            onShowSizeChange={this.onClickPagination}
            hideOnSinglePage={!this.props.isAuthenticated}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    favorites: state.favorites,
    isAuthenticated: state.isAuthenticated
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteView);
