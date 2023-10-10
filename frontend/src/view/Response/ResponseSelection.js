import React, { Component } from 'react';
import { Radio } from 'antd';

class ResponseSelection extends Component {
  render() {
    const { selectedResponse, onChange } = this.props;

    return (
      <Radio.Group style={{ paddingBottom: '16px' }}  onChange={onChange} value={selectedResponse}>
        <Radio value="both">All</Radio>
        <Radio value="assignment">Assignments</Radio>
        <Radio value="questionnaire">Questionnaires</Radio>
      </Radio.Group>
    );
  }
}

export default ResponseSelection;
