import { i18n } from 'i18n';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Table, Popconfirm } from 'antd';
import ButtonLink from 'view/shared/styles/ButtonLink';
import model from 'modules/assessments/assessmentsModel';
import TableWrapper from 'view/shared/styles/TableWrapper';
import actions from 'modules/assessments/list/assessmentsListActions';
import selectors from 'modules/assessments/list/assessmentsListSelectors';
import assessmentsSelectors from 'modules/assessments/assessmentsSelectors';
import destroyActions from 'modules/assessments/destroy/assessmentsDestroyActions';
import destroySelectors from 'modules/assessments/destroy/assessmentsDestroySelectors';

const { fields } = model;

class AssessmentsListTable extends Component {
  // ...Other methods here...

  columns = [
    fields.id.forTable(),
    fields.title.forTable(),
    {
      title: 'Created by',
      dataIndex: 'createdBy',
      render: (_, record) => 
        record && record.createdBy 
        ? (
          <div>
            <Link to={`/iam/${record.createdBy.id}`}>
              {typeof record.createdBy.fullName !== 'undefined' ? record.createdBy.fullName : '-'}
            </Link>
          </div>
        )
        : null
    },
    {
      title: '',
      dataIndex: '',
      width: '160px',
      render: (_, record) => (
        record && (
          <div className="table-actions">
            <Link to={`/assessments/${record.id}`}>
              {i18n('common.view')}
            </Link>
            {this.props.hasPermissionToEdit && (
              <Link to={`/assessments/${record.id}/edit`}>
                {i18n('common.edit')}
              </Link>
            )}
            {this.props.hasPermissionToDestroy && (
              <Popconfirm
                title={i18n('common.areYouSure')}
                onConfirm={() => this.doDestroy(record.id)}
                okText={i18n('common.yes')}
                cancelText={i18n('common.no')}
              >
                <ButtonLink>
                  {i18n('common.destroy')}
                </ButtonLink>
              </Popconfirm>
            )}
          </div>
        )
      ),
    },
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
    );
  }
}

function select(state) {
  return {
    loading:
      selectors.selectLoading(state) ||
      destroySelectors.selectLoading(state),
    rows: selectors.selectRows(state),
    pagination: selectors.selectPagination(state),
    filter: selectors.selectFilter(state),
    selectedKeys: selectors.selectSelectedKeys(state),
    hasPermissionToEdit: assessmentsSelectors.selectPermissionToEdit(
      state,
    ),
    hasPermissionToDestroy: assessmentsSelectors.selectPermissionToDestroy(
      state,
    ),
  };
}

export default connect(select)(AssessmentsListTable);
