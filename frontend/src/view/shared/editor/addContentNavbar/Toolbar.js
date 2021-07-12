import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tooltip } from 'antd';

import DragItem from './DragItem';
import { controls } from './controls';
import { COLUMN_TYPES } from '../constant';

const ToolbarContainer = styled.div`
  background-color: white;
  margin-top: 15px;
  border: solid 1px #e3e3e3;
`;

const ToolbarWrapper = styled.div`
  width: 100%;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.07);
  background-color: white;
  height: auto;
  overflow-y: hidden;
  display: flex;
  padding: 10px 0;
`;

const ContentTypeContainer = styled.div`
  display: block;
  margin: auto;
`;

const TopContent = styled.div`
  display: flex;
  border-bottom: solid 1px gray;
  flex-direction: column;
`;

const BottomContent = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
`;

const AddColumnContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const AddColumnButton = styled.div`
  padding: 0 10px 10px 10px;
  font-size: 1.2rem;
  cursor: pointer;
  & p {
    text-align: center;
    font-size: 13px
  }
`;

const Icon = styled.img`
  height: 25px;
  width: 25px;
  display: block;
  margin: auto
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  text-align: center;
`;

const Toolbar = (props) => {
  const { handleAddColumn, handleAddContent } = props;

  return (
    <ToolbarContainer>
      <ToolbarWrapper>
        <ContentTypeContainer>
          <TopContent>
            <AddColumnContainer>
              <Tooltip title="One column" placement="right">
                <AddColumnButton
                  onClick={() =>
                    handleAddColumn(COLUMN_TYPES.ONE_COLUMN)
                  }
                >
                  <Icon
                    src={require('assets/images/ic_one_col.svg')}
                    alt="one_column"
                  />
                  <p>One column</p>
                </AddColumnButton>
              </Tooltip>
              <Tooltip title="Two column" placement="right">
                <AddColumnButton
                  onClick={() =>
                    handleAddColumn(
                      COLUMN_TYPES.TWO_COLUMNS,
                    )
                  }
                >
                  <Icon
                    src={require('assets/images/ic_two_col.svg')}
                    alt="two_column"
                  />
                  <p>Two column</p>
                </AddColumnButton>
              </Tooltip>
            </AddColumnContainer>
          </TopContent>
          <BottomContent>
            {controls.map((control) => (
              <IconWrapper key={control.key}>
                <DragItem
                  {...control}
                  title={control.title}
                  handleAddContent={handleAddContent}
                />
              </IconWrapper>
            ))}
          </BottomContent>
        </ContentTypeContainer>
      </ToolbarWrapper>
    </ToolbarContainer>
  );
};

Toolbar.propTypes = {
  handleAddColumn: PropTypes.func.isRequired,
  handleAddContent: PropTypes.func.isRequired,
};

export default Toolbar;
