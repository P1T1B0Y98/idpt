import { i18n } from 'i18n';
import { Table } from 'antd';
import _get from 'lodash/get';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import ButtonLink from 'view/shared/styles/ButtonLink';
import TableWrapper from 'view/shared/styles/TableWrapper';
import AuditLogViewModal from 'view/auditLog/AuditLogViewModal';
import model from 'modules/questionnaireResponse/questionnaireResponseModel';
import casedSelectors from 'modules/questionnaireResponse/questionnaireResponseSelectors';
import selectors from 'modules/questionnaireResponse/list/questionnaireResponseListSelectors';
import actions from 'modules/questionnaireResponse/list/questionnaireResponseListActions';

const { fields } = model;
class QuestionnaireResponseListTable extends Component {
  state = {
    selectedValues: null,
  };
  onAuditLogViewModalClose() {
    this.setState({ selectedValues: null });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(actions.doFetch());
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { dispatch } = this.props;

    dispatch(
      actions.doChangePaginationAndSort(pagination, sorter),
    );
  };

  columns = [
    fields.id.forTable(),
    {
      title: 'Questionnaire',
      dataIndex: 'questionnaire',
      render: (_, record) => {
        const questionnaireID = _get(record, 'questionnaire[0]')
        console.log(questionnaireID)
        return questionnaireID ? (<div><Link to={`/questionnaires/${questionnaireID.id}/edit`}>{questionnaireID.title}</Link></div>) : null;
       }
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      render: (record) => {
        if (record) {
          return <Link to={`/iam/${record.id}`}>{record.fullName}</Link>;
        }
        return null; // or any other fallback content
      }
    },
    fields.createdAt.forTable(),
    fields.item.forTable({
      title: "Answer",
      render: (values) => {
        return (
          <ButtonLink
            onClick={() =>
              this.setState({
                selectedValues: JSON.stringify(
                  values,
                  null,
                  2,
                ),
              })
            }
          >
            {i18n('common.view')}
          </ButtonLink>
        );
      },
    }),
  ];

  rowSelection = () => {
    return {
      selectedRowKeys: this.props.selectedKeys,
      onChange: (selectedRowKeys) => {
        const { dispatch } = this.props;
        dispatch(actions.doChangeSelected(selectedRowKeys));
      },
    };
  };

  render() {
    const { pagination, rows, loading } = this.props;

    return (
      <React.Fragment>
      <TableWrapper>
        <Table
          rowKey="id"
          loading={loading}
          columns={this.columns}
          dataSource={rows}
          pagination={pagination}
          onChange={this.handleTableChange}
          rowSelection={this.rowSelection()}
          scroll={{ x: true }}
        />
      </TableWrapper>
      <AuditLogViewModal
        visible={!!this.state.selectedValues}
        code={this.state.selectedValues}
        onCancel={() => this.onAuditLogViewModalClose()}
      />
      </React.Fragment>
    );
  }
}

function select(state) {
  return {
    loading:
      selectors.selectLoading(state),
    rows: selectors.selectRows(state),
    pagination: selectors.selectPagination(state),
    filter: selectors.selectFilter(state),
    selectedKeys: selectors.selectSelectedKeys(state),
    hasPermissionToEdit: casedSelectors.selectPermissionToEdit(
      state,
    ),
    hasPermissionToDestroy: casedSelectors.selectPermissionToDestroy(
      state,
    ),
  };
}

export default connect(select)(QuestionnaireResponseListTable);
