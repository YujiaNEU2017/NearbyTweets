import React, { Component } from 'react';
//redux related
import { connect } from 'react-redux';
//components
import SettingsView from './SettingsView';
import LoginView from './LoginView';
//import '../css/UserView.css';


class UserView extends Component {

  render() {
    if(this.props.isAuthenticated) {
      return(
        <div>
          <SettingsView />
        </div>
      );
    }
    else {
      return(
        <div>
          <LoginView />
        </div>
      );
    }
  }
}


const mapStateToProps = (state) => {
    return {
      isAuthenticated: state.isAuthenticated,
    };
};


export default connect(mapStateToProps)(UserView);
