import React from 'react'
import { SortableElement, sortableHandle } from 'react-sortable-hoc'
import { Card, Switch, Row, Icon, Input, Form, Col, Select } from 'antd'
import { find } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTextWidth,
  faAlignLeft,
  faCheckSquare,
  faDotCircle,
  faUserClock
} from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'

import RenderOptions from './RenderOptions'

const DragHandleWrapper = styled.div`
  display: flex;
  justify: space-between;
  align-items: middle;

  &:hover {
    cursor: pointer;
  }
`

const DragHandle = sortableHandle(() => (
  <DragHandleWrapper>
    <span>:::</span>
  </DragHandleWrapper>
))

const getRule = rules => {
  let required = false
  if (rules && rules.length) {
    required = find(rules, r => r.required === true || r.required === false)
  }
  return required
}

const SortableCard = SortableElement((
  { value: { index, items, ...value }, onDelete, onChange }
) => {
    // Bubble up changes to parent.
  const handleChange = (linkId = '', change) => {
      // Updated questionnaireSchema with changes.
    const allFields = items
      // Update specific property.
    if (linkId) {
      allFields[index] = { ...value, [linkId]: change }
    } else {
        // replace property
      allFields[index] = { ...change, linkId: value.linkId }
    }
    if (onChange) onChange(allFields)
  }

  const handleOptionChange = change => {
    handleChange('answerOption', change)
  }

  const handleSmartwatchDataChange = change => {
    handleChange('smartwatchData', change);
  }

  return (
    <Row type='flex' style={{ zIndex: 1000, margin: 10 }}>
      <Card
        title={<DragHandle />}
        style={{ width: '100%' }}
        actions={[
              (
                <Icon
            type='delete'
            key='delete'
            onClick={() => {
                    if (onDelete) onDelete(value)
                  }}
                />
              ),
              (
                <Switch
            checkedChildren='Required'
            unCheckedChildren='Not required'
            checked={getRule(value.rules).required}
            onChange={checked => {
                    if (value && value.rules && value.rules.length) {
                const ruleIndex = value.rules.indexOf(
                          getRule(value.rules)
                        )
                if (ruleIndex > -1) {
                          // Copy previous rule.
                        const updatedRules = value.rules
                          // Update rule
                        updatedRules[ruleIndex].required = checked
                        updatedRules[ruleIndex].message = 'Field is required'
                        handleChange('questionnaireSchema', updatedRules)
                        handleChange('required', checked)
                      }
              }
                  }}
                />
              ),
          <Icon type='ellipsis' key='ellipsis' />
        ]}
        >
        <Row gutter={16}>
          <Col span={18}>
            <Form.Item required label='Question'>
              {value && value.type === 'textarea' ? <Input.TextArea
                placeholder='Add Question Here'
                value={value.text || ''}
                autosize={{ minRows: 2, maxRows: 6 }}
                onChange={e => {
                  handleChange('text', e.target.value)
                }}
                    /> : <Input
                      value={value.text || ''}
                      placeholder='Add Question Here'
                      onChange={e => {
                        handleChange('text', e.target.value)
                      }}
                    />}
            </Form.Item>
            {}
            <Form.Item>
              <RenderOptions value={value} onChange={handleOptionChange} onSmartwatchDataChange={handleSmartwatchDataChange} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Row>
              <Form.Item required label='Type'>
                <Select
                  value={value.type || ''}
                  style={{ width: '100%' }}
                  onSelect={selected => {
                        // On change, reset.
                    const newField = {
                        text: value.text,
                        type: selected,
                        rules: [
                            { required: false, message: 'Field is required' }
                        ]
                      }
                    if (
                          selected === 'checkbox' ||
                            selected === 'radio' ||
                            selected === 'select' ||
                            selected === 'smartwatch_data'
                        ) {
                        newField.answerOption = []
                      }

                     handleChange('', newField)
                  }}
                  >
                  <Select.Option key='input' value='input'>
                    <FontAwesomeIcon icon={faTextWidth} />
                    <span style={{ marginLeft: 10 }}>Short answer</span>
                  </Select.Option>
                  <Select.Option key='textarea' value='textarea'>
                    <FontAwesomeIcon icon={faAlignLeft} />
                    <span style={{ marginLeft: 10 }}>Paragraph</span>
                  </Select.Option>
                  <Select.Option key='radio' value='radio'>
                    <FontAwesomeIcon icon={faDotCircle} />
                    <span style={{ marginLeft: 10 }}>Multiple choice</span>
                  </Select.Option>
                  <Select.Option key='checkbox' value='checkbox'>
                    <FontAwesomeIcon icon={faCheckSquare} />
                    <span style={{ marginLeft: 10 }}>Checkboxes</span>
                  </Select.Option>
                  <Select.Option key='smartwatch_data' value='smartwatch_data'>
                    <FontAwesomeIcon icon={faUserClock} />
                    <span style={{ marginLeft: 10 }}>Smartwatch Data</span>
                  </Select.Option>
                </Select>
              </Form.Item>
            </Row>
          </Col>
        </Row>
      </Card>
    </Row>
  )
})

export default React.memo(SortableCard)
