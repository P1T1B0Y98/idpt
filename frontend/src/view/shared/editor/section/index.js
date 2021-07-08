import React, { useCallback, useMemo } from 'react';
import { cloneDeep } from 'lodash'
import styled from 'styled-components';

import Section from './Section';
import { SortableContainer, SortableItem, SortableItemTwoCol, SortableContainerTwoCol } from "./Sortable";
import { COLUMN_TYPES, TWO_COLUMN_TYPES, TYPES_OF_CONTENT } from '../constant';

const Sections = (props) => {
  const { listSection, onChange, form } = props;

  const colIndex = useMemo(() => {
    return {
      left: 0,
      right: 1,
    };
  }, []);

  const deepComparison = useCallback((prevValue, nextValue) => {
    return JSON.stringify(prevValue) === JSON.stringify(nextValue)
  }, [])

  const handleSort = useCallback(
    (e) => {
      const cloneListSection = cloneDeep(listSection);
      const { oldIndex, newIndex } = e;
      const movingSection = cloneListSection[oldIndex];

      cloneListSection.splice(oldIndex, 1);
      cloneListSection.splice(newIndex, 0, movingSection);

      !deepComparison(listSection, cloneListSection) && onChange(cloneListSection);
    },
    [listSection],
  );

  const handleDeleteSection = useCallback(
    (sectionId) => {
      const cloneListSection = cloneDeep(listSection);
      const index = cloneListSection.findIndex((section) => section.id === sectionId);
      if (index > -1) {
        cloneListSection.splice(index, 1);
      }

      onChange(cloneListSection);
    },
    [listSection],
  );

  const handleSortChildPage = useCallback(
    (e, sectionId) => {
      const cloneListSection = cloneDeep(listSection);
      const index = cloneListSection.findIndex((section) => section.id === sectionId);
      const { oldIndex, newIndex } = e;

      if (index > -1 && oldIndex !== newIndex) {
        const cloneContent = cloneDeep(cloneListSection[index]);

        cloneContent.leftContent.columnPosition = TWO_COLUMN_TYPES.RIGHT;
        cloneContent.rightContent.columnPosition = TWO_COLUMN_TYPES.LEFT;

        if (cloneContent.leftContent.type === TYPES_OF_CONTENT.EMPTY_LEFT_COLUMN.value) {
          cloneContent.leftContent.type = TYPES_OF_CONTENT.EMPTY_RIGHT_COLUMN.value;
        }

        if (cloneContent.rightContent.type === TYPES_OF_CONTENT.EMPTY_RIGHT_COLUMN.value) {
          cloneContent.rightContent.type = TYPES_OF_CONTENT.EMPTY_LEFT_COLUMN.value;
        }

        const temp = cloneDeep(cloneContent.leftContent);

        cloneContent.leftContent = cloneContent.rightContent;
        cloneContent.rightContent = temp;

        cloneListSection[index] = cloneContent;
      }

      !deepComparison(listSection, cloneListSection) && onChange(cloneListSection);
    },
    [listSection],
  );

  const handleDeleteContent = useCallback(
    (sectionId, parentId, columnPosition) => {
      const cloneListSection = cloneDeep(listSection);
      if (columnPosition) {
        const index = cloneListSection.findIndex((section) => section.id === parentId);
        if (index > -1) {
          if (columnPosition === TWO_COLUMN_TYPES.RIGHT) {
            cloneListSection[index].rightContent.type = TYPES_OF_CONTENT.EMPTY_RIGHT_COLUMN.value;
            cloneListSection[index].rightContent.value = null;
          }

          if (columnPosition === TWO_COLUMN_TYPES.LEFT) {
            cloneListSection[index].leftContent.type = TYPES_OF_CONTENT.EMPTY_LEFT_COLUMN.value;
            cloneListSection[index].leftContent.value = null;
          }
        }
      } else {
        const index = cloneListSection.findIndex((x) => x.id === sectionId);
        if (index > -1) {
          cloneListSection[index].type = TYPES_OF_CONTENT.EMPTY_ONE_COLUMN.value;
          cloneListSection[index].value = null;
        }
      }

      onChange(cloneListSection);
    },
    [listSection],
  );

  const handleChangeContentSection = useCallback(
    (sectionId, value, parentId, columnPosition, additionalProps) => {
      const cloneListSection = cloneDeep(listSection);
      const sectionIndex = parentId
        ? cloneListSection.findIndex((section) => section.id === parentId)
        : cloneListSection.findIndex((section) => section.id === sectionId);

      if (sectionIndex > -1) {
        const sectionEditing = cloneListSection[sectionIndex];

        if (columnPosition) {
          //two column
          if (columnPosition === TWO_COLUMN_TYPES.LEFT) {
            sectionEditing.leftContent.value = value;
            if (additionalProps) {
              const mergedProps = { ...sectionEditing.leftContent, ...additionalProps };
              sectionEditing.leftContent = mergedProps;
            }
          } else {
            sectionEditing.rightContent.value = value;
            if (additionalProps) {
              const mergedProps = { ...sectionEditing.rightContent, ...additionalProps };
              sectionEditing.rightContent = mergedProps;
            }
          }
        } else {
          //one column
          sectionEditing.value = value;
          if (additionalProps) {
            Object.assign(sectionEditing, additionalProps);
          }
        }
      }

      onChange(cloneListSection);
    },
    [listSection],
  );

  return (
    <SectionContainer>
      <SortableContainer axis="y" useDragHandle onSortEnd={handleSort} transitionDuration={300}>
        {listSection && listSection.map((section, index) => {
          switch (section.columnType) {
            case COLUMN_TYPES.ONE_COLUMN:
              return (
                <SortableItem
                  id={section.id}
                  key={section.id}
                  onDeleteSection={handleDeleteSection}
                  index={index}
                >
                  <Section
                    section={section}
                    onChange={handleChangeContentSection}
                    onDelete={handleDeleteContent}
                    form={form}
                  />
                </SortableItem>
              );

            case COLUMN_TYPES.TWO_COLUMNS:
              return (
                <SortableItem
                  id={section.id}
                  key={section.id}
                  onDeleteSection={handleDeleteSection}
                  index={index}
                >
                  <SortableContainerTwoCol
                    axis="x"
                    useDragHandle
                    onSortEnd={(e) => handleSortChildPage(e, section.id)}
                    transitionDuration={300}
                    pressDelay={100}
                  >
                    <SortableItemTwoCol index={colIndex.left} key={section.leftContent.id}>
                      <Section
                        section={section.leftContent}
                        onChange={handleChangeContentSection}
                        parentId={section.id}
                        onDelete={handleDeleteContent}
                        form={form}
                      />
                    </SortableItemTwoCol>
                    <SortableItemTwoCol index={colIndex.right} key={section.rightContent.id}>
                      <Section
                        section={section.rightContent}
                        onChange={handleChangeContentSection}
                        parentId={section.id}
                        onDelete={handleDeleteContent}
                        form={form}
                      />
                    </SortableItemTwoCol>
                  </SortableContainerTwoCol>
                </SortableItem>
              );

            default:
              return null;
          }
        })}
      </SortableContainer>
    </SectionContainer>
  );
};

export default Sections;

const SectionContainer = styled.div`
  margin-top: 30px
`