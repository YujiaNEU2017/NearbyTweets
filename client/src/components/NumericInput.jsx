import React, { Component } from 'react';
import { Input, Tooltip } from 'antd';


class NumericInput extends Component {

  formatNumber = (value) => {
    value += '';
    const list = value.split('.');
    const prefix = list[0].charAt(0) === '-' ? '-' : '';
    let num = prefix ? list[0].slice(1) : list[0];
    let result = '';
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
  }

  onChange = (e) => {
    const { value } = e.target;
    const reg = /^[0-9]*[1-9][0-9]*$/; // positive integer only
    if ((!isNaN(value) && reg.test(value)) || value === '') {
      this.props.onChange(value);
    }
  }

  render() {
    const { value } = this.props;
    const title = value ? (
      <span className="numeric-input-title">
        {this.formatNumber(value)}
      </span>
    ) : 'Input a number';
    return (
      <Tooltip
        trigger={['focus']}
        title={title}
        placement="topLeft"
        overlayClassName="numeric-input"
      >
        <Input
          {...this.props}
          style={{width: "130px"}}
          onChange={this.onChange}
          placeholder="Input a number"
          maxLength="8"
        />
      </Tooltip>
    );
  }
}

export default NumericInput
