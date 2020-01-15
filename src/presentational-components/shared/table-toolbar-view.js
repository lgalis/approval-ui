import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { Toolbar, ToolbarGroup, ToolbarItem, Level, LevelItem } from '@patternfly/react-core';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { scrollToTop } from '../../helpers/shared/helpers';
import { defaultSettings  } from '../../helpers/shared/pagination';
import FilterToolbar from '../../presentational-components/shared/filter-toolbar-item';
import { Section } from '@redhat-cloud-services/frontend-components';
import { TableToolbar } from '@redhat-cloud-services/frontend-components/components/TableToolbar';
import { DataListLoader } from './loader-placeholders';
import AsyncPagination from '../../smart-components/common/async-pagination';

/**
 * Need to optimize this component
 * There is 7 renders before first table render
 * Should be just 2 - Loader -> Table
 */

export const TableToolbarView = ({
  request,
  isSelectable,
  createRows,
  columns,
  toolbarButtons,
  fetchData,
  data,
  actionResolver,
  routes,
  titlePlural,
  titleSingular,
  pagination,
  setCheckedItems,
  filterValue,
  isLoading,
  setFilterValue }) => {
  const [ rows, setRows ] = useState([]);

  useEffect(() => {
    fetchData(setRows, filterValue, pagination);
  }, [ filterValue, pagination.limit, pagination.offset ]);

  useEffect(() => {
    setRows(createRows(data, filterValue));
  }, [ data ]);

  useEffect(() => {
    scrollToTop();
  }, []);

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

  const onCollapse = (_event, _index, _isOpen, { id }) => setRows((rows) => setOpen(rows, id));

  const selectRow = (_event, selected, index, { id } = {}) => index === -1
    ? setRows(rows.map(row => ({ ...row, selected })))
    : setRows((rows) => setSelected(rows, id));

  const renderToolbar = () => {
    return (<TableToolbar>
      <Level style={ { flex: 1 } }>
        <LevelItem>
          <Toolbar>
            <FilterToolbar onFilterChange={ value => setFilterValue(value) } searchValue={ filterValue }
              placeholder={ `Find a ${titleSingular}` }/>
            { toolbarButtons() }
          </Toolbar>
        </LevelItem>

        <LevelItem>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarItem>
                <AsyncPagination
                  apiRequest={ request }
                  isDisabled={ isLoading }
                  meta={ pagination }
                  isCompact
                />
              </ToolbarItem>
            </ToolbarGroup>
          </Toolbar>
        </LevelItem>
      </Level>
    </TableToolbar>);
  };

  return (
    isLoading ? <DataListLoader/> :
      <Section type="content" page-type={ `tab-${titlePlural}` } id={ `tab-${titlePlural}` }>
        { routes() }
        { renderToolbar() }
        <Table
          aria-label={ `${titlePlural} table` }
          onCollapse={ onCollapse }
          rows={ rows }
          cells={ columns }
          onSelect={ isSelectable && selectRow }
          actionResolver={ actionResolver }
          className="table-fix"
        >
          <TableHeader />
          <TableBody />
        </Table>
      </Section>
  );
};

TableToolbarView.propTypes = {
  isSelectable: propTypes.bool,
  createRows: propTypes.func.isRequired,
  request: propTypes.func.isRequired,
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
  setFilterValue: propTypes.func,
  isLoading: propTypes.bool
};

TableToolbarView.defaultProps = {
  requests: [],
  isLoading: false,
  pagination: defaultSettings,
  toolbarButtons: () => null,
  isSelectable: null,
  routes: () => null
};
