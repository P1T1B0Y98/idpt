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
  value: { type, options = [] },
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
          ...options,
          {
            field: `Option ${options.length + 1}`,
            value: ``,
            label: ``,
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
      e.field = `Option ${index + 1}`;
    });
    onChange(newOptions);
  };

  const handleSmartwatchDataChange = (smartwatchData) => {
    const newOptions = Object.entries(smartwatchData).map(([field, value]) => {
      // If value is an object, flatten it
      if (typeof value === 'object' && value !== null) {
        return value;
      }
      return {
        field: field,
        value: value,
      };
    });
  
    // copy existing options
    let mergedOptions = [...options];
  
    newOptions.forEach(newOption => {
      // find the index of the newOption in mergedOptions
      const index = mergedOptions.findIndex(option => option.field === newOption.field);
      
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
        const newOptions = filter(options, (o) => {
          return o.field !== removed.field;
        });
        onOptionsChange(newOptions);
      }}
    />
  );

  if (type === 'smartwatch_data') {
    return <RenderSmartwatchDataOptions value={options} onChange={handleSmartwatchDataChange} />
  }

  return (
    <div>
      {options.map((option, index) => {
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
                        {`Click to edit ${option.field}`}
                      </span>
                    )}
                  </Button>
                )}
                {index === clickedIndex && (
                  <Input
                    value={inputValue}
                    autoFocus
                    placeholder={
                      options[clickedIndex].field
                    }
                    style={{
                      width: 300,
                    }}
                    onBlur={() => {
                      let newOptions = options;
                      newOptions[index].value = inputValue;
                      newOptions[index].label =
                        inputValue ||
                        newOptions[index].field;
                      setClickedIndex(-1);
                      setInputValue('');
                      newOptions = uniqBy(
                        newOptions,
                        (checkOption) => {
                          if (checkOption.value === '') {
                            return checkOption.field;
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
