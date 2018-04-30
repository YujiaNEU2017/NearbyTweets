import React, { Component } from 'react';
//redux related
import { connect } from 'react-redux';
import { onLoginSuccess } from '../actions/items';
//components
import TwitterLogin from 'react-twitter-auth/lib/react-twitter-auth-component.js';
import logo from '../logo.png';
import { Avatar, Badge, Divider } from 'antd';
import '../css/LoginView.css';

class LoginView extends Component {

  onLoginFailed = (error) =>  {
    console.log(error);
  }

  render() {
    return (
      <div className="login-view">
        <img className="app-logo" alt="App Logo: copyright@Corgi for Feedly Lock Screen" src={logo}/>
        <Divider>LOG IN</Divider>
          <div className="user-profile-avatar">
            <Badge count={0}><Avatar icon="user" /></Badge>
          </div>
          <div className="user-profile-twitter-login">
            <TwitterLogin
              loginUrl="/auth/twitter"
              onFailure={this.onLoginFailed}
              onSuccess={this.props.onLoginSuccess}
              requestTokenUrl="/auth/twitter/reverse"
              credentials="include"
            />
          </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginSuccess: (response) => dispatch(onLoginSuccess(response))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
