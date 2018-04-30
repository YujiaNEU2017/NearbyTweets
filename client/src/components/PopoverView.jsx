import React, { Component } from 'react';
//redux related
import { connect } from 'react-redux';
import { Icon, Divider } from 'antd';

class PopoverView extends Component {

  render() {
    const { username, email, city, region, tweets, radius } = this.props;
    return (
      <div>
        <p><span><Icon type="user"/> {username}</span></p>
        <p><span><Icon type="mail"/> {email}</span></p>
        <p><span><Icon type="environment-o"/> {city}, {region}</span></p>
        <Divider dashed/>
        <p>Nearby Tweets: {tweets.length}</p>
        <p>Radius Range: {radius} km</p>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    username: state.username,
    email: state.email,
    city: state.city,
    region: state.region,
    tweets: state.items,
    radius: state.radius
  };
};

export default connect(mapStateToProps)(PopoverView);
