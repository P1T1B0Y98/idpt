import { i18n } from 'i18n';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Table, Popconfirm } from 'antd';
import ButtonLink from 'view/shared/styles/ButtonLink';
import model from 'modules/questionnaires/questionnairesModel';
import TableWrapper from 'view/shared/styles/TableWrapper';
import actions from 'modules/questionnaires/list/questionnairesListActions';
import selectors from 'modules/questionnaires/list/questionnairesListSelectors';
import questionnairesSelectors from 'modules/questionnaires/questionnairesSelectors';
import destroyActions from 'modules/questionnaires/destroy/questionnairesDestroyActions';
import destroySelectors from 'modules/questionnaires/destroy/questionnairesDestroySelectors';

const { fields } = model;

class QuestionnairesListTable extends Component {
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
            <Link to={`/questionnaires/${record.id}`}>
              {i18n('common.view')}
            </Link>
            {this.props.hasPermissionToEdit && (
              <Link to={`/questionnaires/${record.id}/edit`}>
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
    hasPermissionToEdit: questionnairesSelectors.selectPermissionToEdit(
      state,
    ),
    hasPermissionToDestroy: questionnairesSelectors.selectPermissionToDestroy(
      state,
    ),
  };
}

export default connect(select)(QuestionnairesListTable);
