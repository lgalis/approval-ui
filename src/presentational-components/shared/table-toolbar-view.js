
import React, { Fragment, useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { Toolbar, ToolbarGroup, ToolbarItem, Level, LevelItem } from '@patternfly/react-core';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { defaultSettings  } from '../../helpers/shared/pagination';
import FilterToolbar from '../../presentational-components/shared/filter-toolbar-item';
import { Section } from '@redhat-cloud-services/frontend-components';
import { DataListLoader } from './loader-placeholders';
import AsyncPagination from '../../smart-components/common/async-pagination';
import BottomPaginationContainer from '../../presentational-components/shared/bottom-pagination-container';

/**
 * Need to optimize this component
 * There is 7 renders before first table render
 * Should be just 2 - Loader -> Table
 */

export const TableToolbarView = ({
  isSelectable,
  createRows,
  columns,
  fetchData,
  toolbarButtons,
  data,
  actionResolver,
  routes,
  titlePlural,
  titleSingular,
  pagination,
  setCheckedItems,
  filterValue,
  onFilterChange,
  isLoading,
  onCollapse,
  renderEmptyState,
  sortBy,
  onSort
}) => {
  const [ rows, setRows ] = useState([]);

  useEffect(() => {
    setRows(createRows(data));
  }, [ data ]);

  const setOpen = (data, id) => data.map(row => row.id === id ?
    {
      ...row,
      isOpen: !row.isOpen
    } : {
      ...row
    });

  const setSelected = (data, id) => {
    const newData = data.map(row => row.id === id ?
      {
        ...row,
        selected: !row.selected
      } : {
        ...row
      });

    const checkedItems = newData.filter(item => (item.id && item.selected));
    setCheckedItems(checkedItems);
    return newData;
  };

  const onCollapseInternal = (_event, _index, _isOpen, { id }) => onCollapse ?
    onCollapse(id, setRows, setOpen) :
    setRows((rows) => setOpen(rows, id));

  const selectRow = (_event, selected, index, { id } = {}) => index === -1
    ? setRows(rows.map(row => ({ ...row, selected })))
    : setRows((rows) => setSelected(rows, id));

  const renderToolbar = (isLoading) => {
    return (<Toolbar className={ `pf-u-pt-lg pf-u-pr-lg pf-u-pl-lg pf-u-pb-lg top-toolbar` }>
      <Level style={ { flex: 1 } }>
        <LevelItem>
          <Toolbar>
            <FilterToolbar onFilterChange={ onFilterChange } searchValue={ filterValue } isClearable={ true }
              placeholder={ `Filter by ${titleSingular}` }/>
            { toolbarButtons() }
          </Toolbar>
        </LevelItem>

        <LevelItem>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarItem>
                <AsyncPagination
                  apiRequest={ fetchData }
                  isDisabled={ isLoading }
                  meta={ pagination }
                  isCompact
                />
              </ToolbarItem>
            </ToolbarGroup>
          </Toolbar>
        </LevelItem>
      </Level>
    </Toolbar>);
  };

  return (
    <Section type="content" page-type={ `tab-${titlePlural}` } id={ `tab-${titlePlural}` }>
      { routes() }
      { renderToolbar(isLoading) }
      { isLoading && <DataListLoader/> }
      { !isLoading && rows.length === 0 ? (
        renderEmptyState()
      ) :
        <Fragment>
          { !isLoading &&
          <Table
            aria-label={ `${titlePlural} table` }
            onCollapse={ onCollapseInternal }
            rows={ rows }
            cells={ columns }
            onSelect={ isSelectable && selectRow }
            actionResolver={ actionResolver }
            className="table-fix"
            sortBy={ sortBy }
            onSort={ onSort }
          >
            <TableHeader />
            <TableBody/>
          </Table> }
          { pagination.count > 0 &&
            <BottomPaginationContainer>
              <AsyncPagination
                dropDirection="up"
                meta={ pagination }
                apiRequest={ fetchData }
              />
            </BottomPaginationContainer>
          }
        </Fragment>
      }
    </Section>);
};

TableToolbarView.propTypes = {
  isSelectable: propTypes.bool,
  createRows: propTypes.func.isRequired,
  columns: propTypes.array.isRequired,
  toolbarButtons: propTypes.func,
  fetchData: propTypes.func.isRequired,
  data: propTypes.array,
  pagination: propTypes.shape({
    limit: propTypes.number,
    offset: propTypes.number,
    count: propTypes.number
  }),
  titlePlural: propTypes.string,
  titleSingular: propTypes.string,
  routes: propTypes.func,
  actionResolver: propTypes.func,
  setCheckedItems: propTypes.func,
  filterValue: propTypes.string,
  onFilterChange: propTypes.func,
  isLoading: propTypes.bool,
  onCollapse: propTypes.func,
  renderEmptyState: propTypes.func,
  sortBy: propTypes.object,
  onSort: propTypes.func
};

TableToolbarView.defaultProps = {
  requests: [],
  isLoading: false,
  pagination: defaultSettings,
  toolbarButtons: () => null,
  isSelectable: null,
  routes: () => null,
  renderEmptyState: () => null,
  onSort: () => null
};
