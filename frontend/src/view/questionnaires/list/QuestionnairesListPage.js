import React, { Component } from 'react';
import ContentWrapper from 'view/layout/styles/ContentWrapper';
import PageTitle from 'view/shared/styles/PageTitle';
import Breadcrumb from 'view/shared/Breadcrumb';
import { i18n } from 'i18n';
import QuestionnairesListTable from 'view/questionnaires/list/QuestionnairesListTable';
import QuestionnairesListFilter from 'view/questionnaires/list/QuestionnairesListFilter';
import QuestionnaireToolbar from 'view/questionnaires/list/QuestionnairesListToolbar';

class QuestionnairesListPage extends Component {
  render() {
    return (
      <React.Fragment>
        <Breadcrumb
          items={[
            [i18n('home.menu'), '/'],
            [i18n('entities.questionnaires.menu')],
          ]}
        />

        <ContentWrapper>
          <PageTitle>
            {i18n('entities.questionnaires.list.title')}
          </PageTitle>
          <QuestionnaireToolbar />
          <QuestionnairesListFilter />
          <QuestionnairesListTable />
        </ContentWrapper>
      </React.Fragment>
    );
  }
}

export default QuestionnairesListPage;
