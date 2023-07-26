import React, { Component } from 'react';
import { i18n } from 'i18n';
import { connect } from 'react-redux';
import Breadcrumb from 'view/shared/Breadcrumb';
import PageTitle from 'view/shared/styles/PageTitle';
import ContentWrapper from 'view/layout/styles/ContentWrapper';
import actions from 'modules/assessments/form/assessmentsFormActions';
import selectors from 'modules/assessments/form/assessmentsFormSelectors';
import { getHistory } from 'modules/store';

import FormBuilder from './builder/Render';

class AssessmentFormPage extends Component {
  state = {
    dispatched: false,
  };

  async componentDidMount() {
    const { dispatch, match } = this.props;

    if (this.isEditing()) {
      await dispatch(actions.doFind(match.params.id));
    } else {
      dispatch(actions.doNew());
    }

    this.setState({ dispatched: true });
  }

  doSubmit = (id, data) => {
    const { dispatch } = this.props;

    if (this.isEditing()) {
      dispatch(actions.doUpdate(id, data));
    } else {
      dispatch(actions.doCreate(data));
    }
  };

  isEditing = () => {
    const { match } = this.props;
    return !!match.params.id;
  };

  title = () => {
    return this.isEditing()
      ? i18n('entities.assessments.edit.title')
      : i18n('entities.assessments.new.title');
  };

  render() {
    return (
      <React.Fragment>
        <Breadcrumb
          items={[
            [i18n('home.menu'), '/'],
            [
              i18n('entities.assessments.menu'),
              '/assessments',
            ],
            [this.title()],
          ]}
        />
        <ContentWrapper>
          <PageTitle>{this.title()}</PageTitle>
          <FormBuilder
            onSubmit={this.doSubmit}
            record={this.props.record}
            isEditing={this.isEditing()}
            saveLoading={this.props.saveLoading}
            findLoading={this.props.findLoading}
            onCancel={() =>
              getHistory().push('/assessments')
            }
          />
        </ContentWrapper>
      </React.Fragment>
    );
  }
}

function select(state) {
  return {
    findLoading: selectors.selectFindLoading(state),
    saveLoading: selectors.selectSaveLoading(state),
    record: selectors.selectRecord(state),
  };
}

export default connect(select)(AssessmentFormPage);
