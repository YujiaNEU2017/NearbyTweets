import React, { Component } from 'react';
import { Tabs, Icon, message, Spin } from 'antd';
import './App.css';
//redux related
import { connect } from 'react-redux';
import { getCurrentLocation } from './actions/items';
//components
import ListView from './components/ListView';
import MapView from './components/MapView';
import FavoriteView from './components/FavoriteView';
import UserView from './components/UserView';
import LoginBar from './components/LoginBar';
import pickErrorMessage from './utils/errorMessages';

const TabPane = Tabs.TabPane;

class App extends Component {

  componentDidMount() {
    this.props.getLocation();
  }

  render() {
    const { error, isLocationLoading, isLoading } = this.props;
    const tip = isLocationLoading ? 'Loading User Location...' : null;
    const icon = isLocationLoading ? <Icon className="loading-icon" type="global" spin /> : null;
    if (error) {
      message.error(pickErrorMessage(error), 5);
    }
    return (
      <Spin spinning={isLocationLoading || isLoading} tip={tip} indicator={icon} size="large">
        <Tabs tabBarExtraContent={<LoginBar />} size="large">
          <TabPane id="tab-1" tab={<span><Icon type="twitter" />List</span>} key="1" ><ListView /></TabPane>
          <TabPane id="tab-2" tab={<span><Icon type="environment" />Nearby</span>} key="2" ><MapView /></TabPane>
          <TabPane id="tab-3" tab={<span><Icon type="heart" />Favorite</span>} key="3"><FavoriteView /></TabPane>
          <TabPane id="tab-4" tab={<span><Icon type="setting" />Settings</span>} key="4"><UserView /></TabPane>
        </Tabs>
      </Spin>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.error,
    isLocationLoading: state.isLocationLoading,
    isLoading: state.isLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getLocation: () => dispatch(getCurrentLocation())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
