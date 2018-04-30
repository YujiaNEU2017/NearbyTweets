import React from 'react';
import { Select } from 'antd';

const Option = Select.Option;

const OptionSelect = ({ option, onChange }) => {
  return(
    <div>
      <Select defaultValue={option[0]} style={{ width: 110, marginTop: 10, marginLeft: 10 }} onChange={onChange}>
        <Option value={option[0]}>{option[0]}</Option>
        <Option value={option[1]}>{option[1]}</Option>
      </Select>
    </div>
  );
};

export default OptionSelect;
