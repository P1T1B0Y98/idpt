import React, { Component } from 'react';
import ContentWrapper from 'view/layout/styles/ContentWrapper';
import PageTitle from 'view/shared/styles/PageTitle';
import Breadcrumb from 'view/shared/Breadcrumb';
import { i18n } from 'i18n';
import BioGraph from 'view/shared/bioGraph/bioGraph';

class BioGraphPage extends Component {
  patient = this.props.location.state.patient;

  render() {
    const Graph = BioGraph(this.patient.id);
    return (
      <React.Fragment>
        <Breadcrumb
          items={[
            [i18n('home.menu'), '/'],
            [
              i18n('entities.bioAnalyzed.menu'),
              '/bioAnalyzed',
            ],
            [
              i18n(
                'entities.bioAnalyzed.bioGraph.title',
              ),
            ],
          ]}
        />

        <ContentWrapper>
          <PageTitle>
              {this.getPatientsName()}
          </PageTitle>

          <Graph />
        </ContentWrapper>
      </React.Fragment>
    );
  }

  getPatientsName(){
    return this.patient.fullName + "'s graph";
  }
}

export default BioGraphPage;
