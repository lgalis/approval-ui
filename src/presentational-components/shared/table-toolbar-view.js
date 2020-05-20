
import React, { Fragment, useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { defaultSettings, getCurrentPage, getNewPage  } from '../../helpers/shared/pagination';
import { DataListLoader } from './loader-placeholders';
import { useIntl } from 'react-intl';
import { Section } from '@redhat-cloud-services/frontend-components/components/Section';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/components/PrimaryToolbar';

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
  onSort,
  activeFiltersConfig
}) => {
  const intl = useIntl();
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

  const paginationConfig = {
    itemCount: pagination.count,
    page: getCurrentPage(pagination.limit, pagination.offset),
    perPage: pagination.limit,
    onSetPage: (_e, page) => fetchData({ ...pagination, offset: getNewPage(page, pagination.limit) }),
    onPerPageSelect: (_e, size) => fetchData({ ...pagination, limit: size }),
    isDisabled: isLoading
  };

  const renderToolbar = () => (
    <PrimaryToolbar
      className="pf-u-p-lg ins__approval__primary_toolbar"
      pagination={ paginationConfig }
      { ...(toolbarButtons && { actionsConfig: {  actions: [ toolbarButtons() ]}}) }
      filterConfig={ {
        items: [{
          label: intl.formatMessage({
            id: 'name',
            defaultMessage: 'Name'
          }),
          filterValues: {
            id: 'filter-by-name',
            placeholder: intl.formatMessage({
              id: 'filter-by-name',
              defaultMessage: 'Filter by {title}'
            }, { title: titleSingular }),
            'aria-label': intl.formatMessage({
              id: 'filter-by-name',
              defaultMessage: 'Filter by {title}'
            }, { title: titleSingular }),
            onChange: (_event, value) => onFilterChange(value),
            value: filterValue
          }
        }]
      } }
      activeFiltersConfig={ activeFiltersConfig }
    />
  );

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
          { pagination.count > 0 && (
            <PrimaryToolbar
              className="pf-u-pl-lg pf-u-pr-lg ins__approval__primary_toolbar"
              pagination={ {
                ...paginationConfig,
                dropDirection: 'up',
                variant: 'bottom',
                isCompact: false
              } }
            />
          ) }
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
  onSort: propTypes.func,
  activeFiltersConfig: propTypes.object
};

TableToolbarView.defaultProps = {
  requests: [],
  isLoading: false,
  pagination: defaultSettings,
  isSelectable: null,
  routes: () => null,
  renderEmptyState: () => null,
  onSort: () => null
};
