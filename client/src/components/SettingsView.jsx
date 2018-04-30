import React, { Component } from 'react';
//redux related
import { connect } from 'react-redux';
import { saveSettings } from '../actions/items';
//components
//import NumericInput from './NumericInput';
import logo from '../logo.png';

import '../css/SettingsView.css';

import { Radio, Input, Button, Divider } from 'antd';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

class SettingsView extends Component {
  constructor(props) {
    super(props);
    this.radius = this.props.radius;
    this.number = this.props.number;
    this.tag = this.props.tag;
  }

  componentWillUpdate() {
    this.radius = this.props.radius;
    this.number = this.props.number;
    this.tag = this.props.tag;
  }

  onChangeRadius = (e) => {
    this.radius = e.target.value;
  }

  onChangeNumber = (e) => {
    this.number = e.target.value;
  }

  onChangeTag = (e) => {
    this.tag = e.target.value;
  }

  onClickSave = () => {
    const settings = {
      radius: this.radius,
      number: this.number,
      tag: this.tag
    };
    this.props.onClickSave(settings, this.props.location);
  }


  render() {
    return (
      <div className="settings-view">
        <img className="app-logo" alt="App Logo: copyright@Corgi for Feedly Lock Screen" src={logo}/>

        <Divider>USER SETTINGS</Divider>

        <Divider dashed>Radius</Divider>
        <RadioGroup id="radius-group-radius" name="radiusGroup" onChange={this.onChangeRadius} defaultValue={this.props.radius}>
          <RadioButton value={1}>1 km</RadioButton>
          <RadioButton value={2}>2 km</RadioButton>
          <RadioButton value={4}>4 km</RadioButton>
        </RadioGroup>

        <Divider dashed>Number of Items</Divider>
        <RadioGroup id="radius-group-number" name="numberGroup" onChange={this.onChangeNumber} defaultValue={this.props.number}>
          <RadioButton value={10}>10</RadioButton>
          <RadioButton value={20}>20</RadioButton>
          <RadioButton value={30}>30</RadioButton>
        </RadioGroup>

        <Divider dashed>Tag</Divider>
        <div id="input-tag"><Input placeholder="Enter tag" addonBefore="#" onChange={this.onChangeTag} defaultValue={this.props.tag}/></div>

        <Divider></Divider>
        <Button id="button-save-settings" icon="save" onClick={this.onClickSave}>Save Settings</Button>
      </div>

    );

  }
}


const mapStateToProps = (state) => {
  return {
    radius: state.radius,
    number: state.number,
    tag: state.tag,
    location: state.location
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClickSave: (settings, location) => dispatch(saveSettings(settings, location))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView);
