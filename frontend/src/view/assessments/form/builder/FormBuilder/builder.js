import { i18n } from 'i18n';
import React, { useState, useRef } from 'react';
import {
  Form,
  Row,
  Button,
  Input,
  List,
  Col,
  Alert,
  Radio,
} from 'antd';
import arrayMove from 'array-move';
import Spinner from 'view/shared/Spinner';
import { camelCase, isEmpty } from 'lodash';
import { SortableContainer } from 'react-sortable-hoc';
import { connect } from 'react-redux';
import selectors from 'modules/assessments/form/assessmentsFormSelectors';
// import TaskAutocompleteFormItem from 'view/task/autocomplete/TaskAutocompleteFormItem';
import { tailFormItemLayout } from 'view/shared/styles/FormWrapper';

// Import style
import SortableCard from './SortableCard';

const SortableItem = ({
  index,
  value,
  onDelete,
  onChange,
}) => (
  <SortableCard
    onDelete={onDelete}
    onChange={onChange}
    index={index}
    value={value}
  />
);

const SortableSchema = SortableContainer(
  ({ items, header, onChange }) => {
    return (
      <List
        header={header}
        size="large"
        dataSource={items}
        renderItem={(item, index) => {
          return (
            <SortableItem
              onChange={onChange}
              onDelete={(deletedItem) => {
                if (deletedItem) {
                  let found = false;
                  const updatedSchema = items.filter(
                    (i, itemIndex) => {
                      if (i.field === deletedItem.field) {
                        found = true;
                        return false;
                      }
                      if (found) {
                        // eslint-disable-next-line no-param-reassign
                        i.field = camelCase(
                          `Question ${itemIndex}`,
                        );
                      }
                      return true;
                    },
                  );
                  onChange(updatedSchema);
                }
              }}
              index={index}
              value={{ ...item, index, items }}
            />
          );
        }}
      />
    );
  },
);

const emptyField = [
  {
    type: 'input',
    placeholder: '',
    question: ``,
    field: camelCase(`Question1`),
    rules: [
      { required: false, message: 'Field is required' },
    ],
  },
];

const checkType = (value) => {
  return value === 'stress' || value === 'mental_health' || value === 'physical_health';
};

const checkFrequency = (value) => {
  return value === 'none' || value === 'daily' || value === 'weekly' || value === 'monthly' || value === 'quarterly';
};

const checkLabels = (items) => {
  const notValid = items.filter(
    (item) =>
      item.question === '' ||
      item.question === undefined ||
      item.question === null,
  );

  return notValid.length === 0;
};

const checkOptions = (items) => {
  for (let i = 0; i < items.length; i += 1) {
    const currQuestion = items[i];
    if (
      currQuestion.type === 'radio' ||
      currQuestion.type === 'checkbox' ||
      currQuestion.type === 'select' ||
      currQuestion.type === 'smartwatch_data'
    ) {
      const currOptions = currQuestion.options;
      if (currOptions.length <= 0) {
        return false;
      }

      for (let j = 0; j < currOptions.length; j += 1) {
        if (currOptions[j].value === '') {
          return false;
        }
      }
    }
  }
  return true;
};

const SchemaList = React.forwardRef(
  ({ value, onChange, header }, ref) => {
    // const bottomRef = useRef(null);
    const handleChange = (change) => {
      onChange(change);
    };
    return (
      <Row>
        <Col
          // span={22}
          ref={ref}
        >
          <Row style={{ background: '#ECECEC' }}>
            <SortableSchema
              items={value}
              onChange={handleChange}
              header={header}
              onSortEnd={({ oldIndex, newIndex }) => {
                // Re-assigned avoid mutation.
                let updatedSchema = value;
                updatedSchema = arrayMove(
                  updatedSchema,
                  oldIndex,
                  newIndex,
                );
                updatedSchema.forEach((e, index) => {
                  e.field = camelCase(
                    `Question ${index + 1}`,
                  );
                });
                handleChange(updatedSchema);
              }}
            />
          </Row>
          <Row>
            <Button
              style={{ marginTop: 10 }}
              type="primary"
              icon="plus"
              title="Add new"
              block
              onClick={() => {
                const updatedList = [
                  ...value,
                  {
                    type: 'input',
                    question: ``,
                    field: camelCase(
                      `Question ${value.length + 1}`,
                    ),
                    rules: [
                      {
                        required: false,
                        message: 'Field is required',
                      },
                    ],
                  },
                ];
                handleChange(updatedList);
              }}
            >
              Add new question
            </Button>
          </Row>
        </Col>
      </Row>
    );
  },
);

const FormBuilder = (props) => {
  const [errors, setErrors] = useState([]);
  const formRef = useRef(null);
  const {
    onError,
    form: { getFieldDecorator, validateFields },
    formId = null,
    record,
    isEditing,
    findLoading,
    saveLoading,
    onCancel,
  } = props;

  const handleSubmit = (e) => {
    setErrors([]);
    e.preventDefault();
    validateFields((err, { id, ...formData }) => {
      if (!err) {
        props.onSubmit(id, formData);
      } else if (onError) {
        setErrors(err.schema.errors);
        onError(err);
      }
    });
  };

  if (findLoading) {
    return <Spinner />;
  }

  if (!record && isEditing) {
    return <Spinner />;
  }

  if (isEditing && record.id)
    getFieldDecorator('id', { initialValue: record.id });
  if (isEditing && record.type)
    getFieldDecorator('type', {
      initialValue: record.type,
    });

  return (
    <>
      {errors.length > 0 && (
        <Alert
          type="error"
          message="Error"
          showIcon
          description={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          }
        />
      )}
      <Form
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            return false;
          }
          return true;
        }}
        colon={false}
        onSubmit={handleSubmit}
        noValidate
        id={formId}
        ref={formRef}
      >
        <Form.Item label="Title">
          {getFieldDecorator('title', {
            initialValue: record ? record.title : '',
          })(<Input placeholder="Add form title" />)}
        </Form.Item>
        <Form.Item required label="Assessment Type">
          {getFieldDecorator('assessment_type', {
            initialValue: record ? record.assessment_type : '',
            rules: [
              {
                validator: (rule, value, callback) => {
                  if (!checkType(value)) {
                    callback('Please provide a valid assessment type.');
                  }
                  callback();
                },
              },
            ],
          })(
            <Radio.Group>
              <Radio value="stress">Stress</Radio>
              <Radio value="mental_health">Mental Health</Radio>
              <Radio value="physical_health">Physical Health</Radio>
            </Radio.Group>,
          )}
        </Form.Item>
        <Form.Item required label="Recurring assessment">
          {getFieldDecorator('frequency', {
            initialValue: record ? record.frequency : '',
            rules: [
              {
                validator: (rule, value, callback) => {
                  if (!checkFrequency(value)) {
                    callback('Please select one of the values over');
                  }
                  callback();
                },
              },
            ],
          })(
            <Radio.Group>
              <Radio value="none">None</Radio>
              <Radio value="daily">Daily</Radio>
              <Radio value="weekly">Weekly</Radio>
              <Radio value="monthly">Monthly</Radio>
            </Radio.Group>,
          )}
        </Form.Item>
        <Row>
          <Form.Item validateStatus={null} help={null}>
            {getFieldDecorator('assessmentSchema', {
              initialValue:
                record && !isEmpty(record.assessmentSchema)
                  ? record.assessmentSchema
                  : emptyField,
              rules: [
                {
                  validator: (rule, value, callback) => {
                    if (!checkLabels(value)) {
                      callback(
                        'Please provide questions. All questions are required.',
                      );
                    }
                    if (!checkOptions(value)) {
                      callback(
                        'Please provide options for questions. All options require names/values.',
                      );
                    }
                    callback();
                  },
                },
              ],
            })(<SchemaList />)}
          </Form.Item>
        </Row>
        <Form.Item
          className="form-buttons"
          {...tailFormItemLayout}
        >
          <Button
            loading={saveLoading}
            type="primary"
            // onClick={form.handleSubmit}
            icon="save"
            htmlType="submit"
            size="large"
          >
            {i18n('common.save')}
          </Button>
          {props.onCancel ? (
            <Button
              disabled={saveLoading}
              onClick={() => onCancel()}
              icon="close"
              size="large"
            >
              {i18n('common.cancel')}
            </Button>
          ) : null}
        </Form.Item>
      </Form>
    </>
  );
};

function select(state) {
  return {
    findLoading: selectors.selectFindLoading(state),
    saveLoading: selectors.selectSaveLoading(state),
    record: selectors.selectRecord(state),
  };
}

export default connect(select)(
  Form.create({
    name: 'form_builder',
  })(FormBuilder),
);
