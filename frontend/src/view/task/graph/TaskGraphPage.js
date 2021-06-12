import React, {Component} from 'react';
import PageSubTitle from 'view/shared/styles/PageSubTitle';
import {Card, Col, Row} from "antd";

import selectors from 'modules/task/graph/taskGraphSelectors';
import destroySelectors from 'modules/task/destroy/taskDestroySelectors';
import taskSelectors from 'modules/task/taskSelectors';
import actions from "../../../modules/task/graph/taskGraphActions";
import {connect} from "react-redux";

import TaskGraphFilter from "./TaskGraphFilter";
import TaskGraph from "./TaskGraph";
import TaskViewContent from "../view/TaskViewContent";
import {i18n} from "../../../i18n";

class TaskGraphPage extends Component {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(actions.doFetch());
  }

  renderTask() {
    const {loading, taskRecord, moduleRecord} = this.props

    const twoColumnsResponsiveProps = {
      xs: 24, sm: 24, md: 12, lg: 12, xl: 12, style: {marginBottom: 24},
    };

    return (
      <React.Fragment>
        <PageSubTitle>
          {i18n('overview.titles.tasks')}
        </PageSubTitle>

        <TaskGraphFilter moduleRecord={moduleRecord}/>

        <Row gutter={24}>
          <Col {...twoColumnsResponsiveProps}>
            <Card bodyStyle={{padding: 8, height: "500px"}}>
              <TaskGraph/>
            </Card>
          </Col>

          <Col {...twoColumnsResponsiveProps}>
            <Card bodyStyle={{padding: 8, height: "500px", overflow: "auto"}}>
              {!taskRecord ? <p>{i18n('overview.instructions.left')}</p> :
                <TaskViewContent
                  loading={loading}
                  record={taskRecord}
                />
              }
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }

  render() {
    const {casedRecord, moduleRecord} = this.props;

    if (!casedRecord) {
      return null;
    }

    if (!moduleRecord) {
      return <p>{i18n('overview.instructions.above')}</p>;
    }

    return this.renderTask();
  }
}

function select(state) {
  return {
    loading: selectors.selectLoading(state) || destroySelectors.selectLoading(state),
    moduleFilter: selectors.selectFilter(state),
    taskRows: selectors.selectRows(state),
    taskRecord: selectors.selectRecord(state),
    hasPermissionToEdit: taskSelectors.selectPermissionToEdit(state,),
    hasPermissionToDestroy: taskSelectors.selectPermissionToDestroy(state,),
    hasPermissionToRead: taskSelectors.selectPermissionToRead(state,),
  };
}

export default connect(select)(TaskGraphPage);