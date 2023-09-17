import React, { useState } from 'react';
import { Form, Select } from 'antd';

const dataOptions = ['Stress', 'Sleep', 'Exercise']; // add here what to collect from the smartwatch
const timeIntervalOptions = ['5 min', '30 min', '1 hour', 'day', 'week', 'month']; // add here the time interval options

const RenderSmartwatchDataOptions = ({ value = {}, onChange }) => {
  const [dataOption, setDataOption] = useState(value.dataOption || 'Please select data type');
  const [timeIntervalOption, setTimeIntervalOption] = useState(
    value.timeIntervalOption || 'Please select time interval for collection'
  );

  const handleDataOptionSelect = selected => {
    setDataOption(selected);
    if (onChange) {
      onChange({ ...value, dataOption: selected });
    }
  };

  const handleTimeIntervalOptionSelect = selected => {
    setTimeIntervalOption(selected);
    if (onChange) onChange({ ...value, timeIntervalOption: selected });
  };

  return (
    <>
      <Form.Item
        required
        label="What type of data to collect"
        rules={[{ required: true, message: 'Please select what data to collect!' }]}
      >
        <Select
          value={dataOption || ''}
          style={{ width: '100%' }}
          onSelect={handleDataOptionSelect}
          placeholder="Select type of data to collect"
        >
          {dataOptions.map(option => (
            <Select.Option key={option} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        required
        label="Time interval for collection:"
        rules={[{ required: true, message: 'Please select a time interval!' }]}
      >
        <Select
          value={timeIntervalOption || ''}
          style={{ width: '100%' }}
          onSelect={handleTimeIntervalOptionSelect}
          placeholder="Select time interval for collection"
          disabled={dataOption === 'Please select data type'}
        >
          {timeIntervalOptions.map(option => (
            <Select.Option key={option} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};

export default React.memo(RenderSmartwatchDataOptions);
