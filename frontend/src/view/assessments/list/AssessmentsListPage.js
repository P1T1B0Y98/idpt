import React, { Component } from 'react';
import ContentWrapper from 'view/layout/styles/ContentWrapper';
import PageTitle from 'view/shared/styles/PageTitle';
import Breadcrumb from 'view/shared/Breadcrumb';
import { i18n } from 'i18n';
import AssessmentsListTable from 'view/assessments/list/AssessmentsListTable';
import AssessmentsListFilter from 'view/assessments/list/AssessmentsListFilter';
import AssessmentToolbar from 'view/assessments/list/AssessmentsListToolbar';

class AssessmentsListPage extends Component {
  render() {
    return (
      <React.Fragment>
        <Breadcrumb
          items={[
            [i18n('home.menu'), '/'],
            [i18n('entities.assessments.menu')],
          ]}
        />

        <ContentWrapper>
          <PageTitle>
            {i18n('entities.assessments.list.title')}
          </PageTitle>
          <AssessmentToolbar />
          <AssessmentsListFilter />
          <AssessmentsListTable />
        </ContentWrapper>
      </React.Fragment>
    );
  }
}

export default AssessmentsListPage;
