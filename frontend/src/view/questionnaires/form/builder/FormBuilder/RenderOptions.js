import React, { useState } from 'react';
import {
  Radio,
  Button,
  Checkbox,
  Input,
  Col,
  Row,
} from 'antd';
import { filter, uniqBy } from 'lodash';
import RenderSmartwatchDataOptions from './RenderSmartwatchDataOptions';

const RenderOptions = ({
  value: { type, answerOption = [] },
  onChange,
}) => {
  const [clickedIndex, setClickedIndex] = useState(-1);
  const [inputValue, setInputValue] = useState('');

  const addNewButton = (
    <Button
      type="ghost"
      title="Add"
      icon="plus"
      size="default"
      style={{ marginTop: 10 }}
      onClick={() => {
        const newOptions = [
          ...answerOption,
          {
            value: ``,
            label: `Option ${answerOption.length + 1}`,
          },
        ];
        setClickedIndex(-1);
        onChange(newOptions);
      }}
    >
      Add new option
    </Button>
  );

  const onOptionsChange = (newOptions) => {
    newOptions.forEach((e, index) => {
      e.label = `Option ${index + 1}`;
    });
    onChange(newOptions);
  };

  const handleSmartwatchDataChange = (smartwatchData) => {
    const newOptions = Object.entries(smartwatchData).map(([label, value]) => {
      // If value is an object, flatten it
      if (typeof value === 'object' && value !== null) {
        return value;
      }
      return {
        label: label,
        value: value,
      };
    });
  
    // copy existing options
    let mergedOptions = [...answerOption];
  
    newOptions.forEach(newOption => {
      // find the index of the newOption in mergedOptions
      const index = mergedOptions.findIndex(option => option.label === newOption.label);
      
      if (index !== -1) { 
        // if newOption exists, update its value
        mergedOptions[index].value = newOption.value; 
      } else {
        // if newOption does not exist, add it to the mergedOptions
        mergedOptions.push(newOption);
      }
    });
  
    onChange(mergedOptions);
  };
  

  const removeButton = (removed) => (
    <Button
      type="link"
      icon="close"
      size="small"
      style={{ marginLeft: 10 }}
      onClick={() => {
        const newOptions = filter(answerOption, (o) => {
          return o.label !== removed.label;
        });
        onOptionsChange(newOptions);
      }}
    />
  );

  if (type === 'wearable') {
    return <RenderSmartwatchDataOptions value={answerOption} onChange={handleSmartwatchDataChange} />
  }

  return (
    <div>
      {answerOption.map((option, index) => {
        return (
          <div style={{ marginTop: '5px' }} key={index}>
            <Row
              type="flex"
              justify="start"
              align="middle"
              gutter={16}
            >
              <Col span={1}>
                {type === 'radio' && <Radio disabled />}
                {type === 'checkbox' && (
                  <Checkbox disabled />
                )}
                {type === 'select' && (
                  <span>{index + 1}</span>
                )}
              </Col>
              <Col span={10}>
                {index !== clickedIndex && (
                  <Button
                    type="dashed"
                    block
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    onClick={() => {
                      setInputValue(option.value);
                      setClickedIndex(index);
                    }}
                  >
                    {option.value ? (
                      option.value
                    ) : (
                      <span style={{ color: '#ccc' }}>
                        {`Click to edit ${option.label}`}
                      </span>
                    )}
                  </Button>
                )}
                {index === clickedIndex && (
                  <Input
                    value={inputValue}
                    autoFocus
                    placeholder={
                      answerOption[clickedIndex].label
                    }
                    style={{
                      width: 300,
                    }}
                    onBlur={() => {
                      let newOptions = answerOption;
                      newOptions[index].value = inputValue;
                      newOptions[index].label =
                        inputValue ||
                        newOptions[index].label;
                      setClickedIndex(-1);
                      setInputValue('');
                      newOptions = uniqBy(
                        newOptions,
                        (checkOption) => {
                          if (checkOption.value === '') {
                            return checkOption.label;
                          }
                          return checkOption.value;
                        },
                      );
                      onOptionsChange(newOptions);
                    }}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                    }}
                  />
                )}
              </Col>
              <Col span={1}>
                {index !== clickedIndex &&
                  removeButton(option)}
              </Col>
            </Row>
          </div>
        );
      })}
      {(type === 'checkbox' ||
        type === 'radio' ||
        type === 'select') &&
        addNewButton}
    </div>
  );
};

export default React.memo(RenderOptions);
