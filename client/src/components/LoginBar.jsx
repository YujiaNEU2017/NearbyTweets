import React, { Component } from 'react';
//redux related
import { connect } from 'react-redux';
import { onLoginSuccess, onLogoutSuccess } from '../actions/items';
//components
import PopoverView from './PopoverView';
import TwitterLogin from 'react-twitter-auth/lib/react-twitter-auth-component.js';
import { Button, Avatar, Badge, Modal, Popover, Tooltip } from 'antd';

import '../css/LoginBar.css';

const confirm = Modal.confirm;


class LoginBar extends Component {

  onLoginFailed = (error) =>  {
    console.log(error);
  }

  onClickConfirmLogout = () => {
    localStorage.removeItem('x-auth-token');
    this.props.logout();
  };

  showLogoutConfirm = () =>  {
    confirm({
      title: 'Do you want to log out ?',
      content: 'Click OK to confirm',
      onOk: () => {
        this.onClickConfirmLogout();
      },
      onCancel: () => {
        console.log('Cancel logout');
      },
    });
  }

  render() {
    if(!this.props.isAuthenticated) {
      return (
        <span>
          <Tooltip title="Please login first">
            <div className="user-avatar"><Badge count={0}><Avatar icon="user"/></Badge></div>
          </Tooltip>
          <TwitterLogin
            loginUrl="/auth/twitter"
            onFailure={this.onLoginFailed}
            onSuccess={this.props.onLoginSuccess}
            requestTokenUrl="/auth/twitter/reverse"
            credentials="include"
            className="user-login-with-twitter"
          />
        </span>
      );
    }

    else {
      return(
        <span>
          <Popover content={<PopoverView/>} trigger="hover">
            <div className="user-avatar"><Badge count={this.props.tweets.length}><Avatar src={this.props.avatar}/></Badge></div>
          </Popover>
          <Button id="button-log-out" icon="logout" onClick={this.showLogoutConfirm}>Log Out</Button>
        </span>
      );
    }

  }
}


const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.isAuthenticated,
    tweets: state.items,
    avatar: state.avatar
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginSuccess: (response) => dispatch(onLoginSuccess(response)),
    logout: () => dispatch(onLogoutSuccess())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginBar);
