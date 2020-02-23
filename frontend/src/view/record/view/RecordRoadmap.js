import { Table, Popconfirm } from 'antd';
import { i18n } from 'i18n';
import model from 'modules/record/recordModel';
import React, { Component } from 'react';
import TableWrapper from 'view/shared/styles/TableWrapper';
import { Link } from 'react-router-dom';

const { fields } = model;

class RecordListTable extends Component {
  columns = [
    fields['roadmap.host'].forTable({
      render: (_, record) => record.host.name
    }),
    fields['roadmap.completionRequired'].forTable({
      width: 150,
      render: (_, record) => record.completionRequired ? 'True' : 'False'
    }),
    fields['roadmap.state'].forTable({
      width: 100,
      render: (_, record) => record.state
    }),
    {
      title: '',
      dataIndex: '',
      width: '80px',
      render: (_, record) => record.__typename === 'RecorcRoadmapContainer' && (
        <div className="table-actions">
          <Link to={`/record-task/${record.id}`}>
            {i18n('common.view')}
          </Link>
        </div>
      ),
    }
  ];

  render() {
    const record = this.props.record || {};

    return (
      <TableWrapper>
        <Table
          columns={this.columns}
          rowKey={({ host }) => host.id}
          dataSource={record.roadmap || []}
          scroll={{ x: true }}
        />
      </TableWrapper>
    );
  }
}

export default RecordListTable
