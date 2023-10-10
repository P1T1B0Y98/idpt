import { i18n } from 'i18n';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import Toolbar from 'view/shared/styles/Toolbar';
import { Button, Tooltip, Popconfirm } from 'antd';
import auditLogSelectors from 'modules/auditLog/auditLogSelectors';
import actions from 'modules/questionnaireResponse/list/questionnaireResponseListActions';
import questionnairesResponseSelectors from 'modules/questionnaireResponse/questionnaireResponseSelectors';
import selectors from 'modules/questionnaireResponse/list/questionnaireResponseListSelectors';
import destroyActions from 'modules/questionnaireResponse/destroy/questionnairesDestroyActions';
import destroySelectors from 'modules/questionnaireResponse/destroy/questionnairesDestroySelectors';

class QuestionnaireResponseToolbar extends Component {
  doExport = () => {
    const { dispatch } = this.props;
    dispatch(actions.doExport());
  };

  doDestroyAllSelected = () => {
    const { dispatch } = this.props;
    dispatch(
      destroyActions.doDestroyAll(this.props.selectedKeys),
    );
  };

  renderExportButton() {
    const { hasRows, loading, exportLoading } = this.props;

    const disabled = !hasRows || loading;

    const button = (
      <Button
        disabled={disabled}
        icon="file-excel"
        onClick={this.doExport}
        loading={exportLoading}
        size="large"
      >
        {i18n('common.export')}
      </Button>
    );

    if (disabled) {
      return (
        <Tooltip title={i18n('common.noDataToExport')}>
          {button}
        </Tooltip>
      );
    }

    return button;
  }

  renderDestroyButton() {
    const {
      selectedKeys,
      destroyLoading,
      loading,
      hasPermissionToDestroy,
    } = this.props;

    if (!hasPermissionToDestroy) {
      return null;
    }

    const disabled = !selectedKeys.length || loading;

    const button = (
      <Button
        disabled={disabled}
        loading={destroyLoading}
        type="primary"
        icon="delete"
        size="large"
      >
        {i18n('common.destroy')}
      </Button>
    );

    const buttonWithConfirm = (
      <Popconfirm
        title={i18n('common.areYouSure')}
        onConfirm={() => this.doDestroyAllSelected()}
        okText={i18n('common.yes')}
        cancelText={i18n('common.no')}
      >
        {button}
      </Popconfirm>
    );

    if (disabled) {
      return (
        <Tooltip title={i18n('common.mustSelectARow')}>
          {button}
        </Tooltip>
      );
    }

    return buttonWithConfirm;
  }

  render() {
    return (
      <Toolbar>


        {this.renderDestroyButton()}

        {this.props.hasPermissionToAuditLogs && (
          <Link to="/audit-logs?entityNames=questionnaireResponse&assignmentResponse">
            <Button icon="file-search" size="large">
              {i18n('auditLog.menu')}
            </Button>
          </Link>
        )}

        {this.renderExportButton()}
      </Toolbar>
    );
  }
}

function select(state) {
  return {
    selectedKeys: selectors.selectSelectedKeys(state),
    loading: selectors.selectLoading(state),
    destroyLoading: destroySelectors.selectLoading(state),
    exportLoading: selectors.selectExportLoading(state),
    hasRows: selectors.selectHasRows(state),
    hasPermissionToAuditLogs: auditLogSelectors.selectPermissionToRead(
      state,
    ),
    hasPermissionToEdit: questionnairesResponseSelectors.selectPermissionToEdit(
      state,
    ),
    hasPermissionToDestroy: questionnairesResponseSelectors.selectPermissionToDestroy(
      state,
    ),
    hasPermissionToCreate: questionnairesResponseSelectors.selectPermissionToCreate(
      state,
    ),
    hasPermissionToImport: questionnairesResponseSelectors.selectPermissionToImport(
      state,
    ),
  };
}

export default connect(select)(QuestionnaireResponseToolbar);
