import { Button, Form } from 'antd';
import { Formik } from 'formik';
import { i18n } from 'i18n';
import model from 'modules/record/recordModel';
import React, { Component } from 'react';
import ViewFormItem from 'view/shared/form/items/ViewFormItem';
import Spinner from 'view/shared/Spinner';
import FormWrapper, {
  tailFormItemLayout,
} from 'view/shared/styles/FormWrapper';
import FormSchema from 'view/shared/form/formSchema';
import { Link } from 'react-router-dom';
import PatientAutocompleteFormItem from 'view/patient/autocomplete/PatientAutocompleteFormItem';
import RelationToOneField from 'modules/shared/fields/relationToOneField';

//const { fields } = model;
const fields = {
  patient: new RelationToOneField('patient', 'Patient', {
    required: true
  }),
}

var formValues;

class BioGraphForm extends Component {
  schema = new FormSchema(fields.id, [
    fields.patient,
  ]);

  handleSubmit = (values) => {
    const { id, ...data } = this.schema.cast(values);
    console.log(values.patient);
    console.log("YOOOO");
    formValues = values.patient;
  };

  initialValues = () => {
    const record = this.props.record;
    return this.schema.initialValues(record || {});
  };

  renderForm() {
    const { saveLoading, isEditing } = this.props;
    return (
      <FormWrapper>
        <Formik
          initialValues={this.initialValues()}
          validationSchema={this.schema.schema}
          onSubmit={this.handleSubmit}
          render={(form) => {
            return (
              <Form onSubmit={form.handleSubmit}>
                {isEditing && (
                  <ViewFormItem
                    name={fields.id.name}
                    label={fields.id.label}
                  />
                )}
                <PatientAutocompleteFormItem
                  name={fields.patient.name}
                  label={fields.patient.label}
                  required={fields.patient.required}
                  form={form}
                />
                <Form.Item
                  className="form-buttons"
                  {...tailFormItemLayout}
                >
                
                <Button
                  loading={saveLoading}
                  type="primary"
                  onClick={form.handleSubmit}
                  icon="save"
                >
                  {i18n('common.save')}
                </Button>
                
                <Link to = {{pathname: '/bioAnalyzed/bioGraph', state: {patient: this.formValues }}}>
                  <Button
                    type="primary"
                    icon="upload"
                  >
                    {i18n('common.bioGraph')}
                  </Button>
                </Link>
                

                <Button
                  disabled={saveLoading}
                  onClick={form.handleReset}
                  icon="undo"
                >
                  {i18n('common.reset')}
                </Button>

                {this.props.onCancel ? (
                  <Button
                    disabled={saveLoading}
                    onClick={() => this.props.onCancel()}
                    icon="close"
                  >
                    {i18n('common.cancel')}
                  </Button>
                ) : null}
                </Form.Item>
              </Form>
            );
          }}
        />
      </FormWrapper>
    );
  }

  render() {
    const { isEditing, findLoading, record } = this.props;

    if (findLoading) {
      return <Spinner />;
    }

    if (isEditing && !record) {
      return <Spinner />;
    }

    return this.renderForm();
  }
}

export default BioGraphForm;
