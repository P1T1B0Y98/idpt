import React, { Component } from 'react'
import { i18n } from 'i18n'
import Breadcrumb from 'view/shared/Breadcrumb'
import PageTitle from 'view/shared/styles/PageTitle'
import PageSubTitle from '../../shared/styles/PageSubTitle'
import ContentWrapper from 'view/layout/styles/ContentWrapper'
import AssignmentResponseListTable from 'view/Response/list/AssignmentResponseListTable'
import QuestionnaireResponseListTable from 'view/Response/list/QuestionnaireResponseListTable'
import ResponseSelection from 'view/Response/ResponseSelection'
import ResponseListFilter from './ResponseListFilter'
import QuestionnaireResponseToolbar from './ResponseListToolbar'
class ResponseListPage extends Component {
  state = {
    selectedResponse: 'both', // Default selection
  };

  handleResponseChange = (e) => {
    this.setState({ selectedResponse: e.target.value });
  };


  render () {
    const { selectedResponse } = this.state;
    return (
      <React.Fragment>
        <Breadcrumb
          items={
            [
              [ i18n('home.menu'), '/' ],
              [ i18n('entities.assignmentResponse.menu') ]
            ]
          }
        />
        <ContentWrapper>
          <PageTitle>
            {i18n('entities.assignmentResponse.list.title')}
          </PageTitle>
          <QuestionnaireResponseToolbar />
          <ResponseSelection 
            selectedResponse={selectedResponse}
            onChange={this.handleResponseChange} 
          />
          <ResponseListFilter />
          {selectedResponse === 'assignment' && (
            <React.Fragment>
              <PageSubTitle>
                {i18n('entities.assignmentResponse.list.sub_title')}
              </PageSubTitle>
              <AssignmentResponseListTable/>
            </React.Fragment>
          )}
          {selectedResponse === 'questionnaire' && (
            <React.Fragment>
              <PageSubTitle>
                {i18n('entities.questionnaireResponse.list.sub_title')}
              </PageSubTitle>
              <QuestionnaireResponseListTable/>
            </React.Fragment>
          )}
          {selectedResponse === 'both' && (
            <React.Fragment>
              <PageSubTitle>
                {i18n('entities.assignmentResponse.list.sub_title')}
              </PageSubTitle>
              <AssignmentResponseListTable />
              <PageSubTitle>
                {i18n('entities.questionnaireResponse.list.sub_title')}
              </PageSubTitle>         
              <QuestionnaireResponseListTable />
            </React.Fragment>
          )}
        </ContentWrapper>
      </React.Fragment>
    )
  }
}

export default ResponseListPage
