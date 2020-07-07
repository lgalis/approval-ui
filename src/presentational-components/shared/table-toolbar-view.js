
import React, { Fragment, useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { defaultSettings, getCurrentPage, getNewPage  } from '../../helpers/shared/pagination';
import { DataListLoader } from './loader-placeholders';
import { useIntl } from 'react-intl';
import { Section } from '@redhat-cloud-services/frontend-components/components/cjs/Section';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/components/cjs/PrimaryToolbar';

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
  actionsDisabled,
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
  activeFiltersConfig,
  filterConfig,
  indexpath
}) => {
  const intl = useIntl();
  const [ rows, setRows ] = useState([]);

  useEffect(() => {
    setRows(createRows(data, actionsDisabled, indexpath));
  }, [ data ]);

  const setOpen = (data, id) => data.map(row => row.id === id ?
    {
      ...row,
      isOpen: !row.isOpen
    } : {
      ...row
    });

  const setSelected = (_event, selected, index, { id } = {}) => {
    const newData = rows.map(row => row.id === id || index === -1 ?
      {
        ...row,
        selected: index === -1 ? selected : !row.selected
      } : {
        ...row
      });

    const checkedItems = newData.filter(item => (item.id && item.selected));
    setCheckedItems(checkedItems);
    return setRows(newData);
  };

  const onCollapseInternal = (_event, _index, _isOpen, { id }) => onCollapse
    ? onCollapse(id, setRows, setOpen)
    : setRows(setOpen(rows, id));

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
        },
        ...filterConfig
        ]
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
            onSelect={ isSelectable && setSelected }
            actionResolver={ actionResolver }
            className="pf-u-pt-0"
            sortBy={ sortBy }
            onSort={ onSort }
            canSelectAll
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
  activeFiltersConfig: propTypes.object,
  filterConfig: propTypes.array,
  actionsDisabled: propTypes.func,
  indexpath: propTypes.shape( { index: propTypes.string })
};

TableToolbarView.defaultProps = {
  requests: [],
  isLoading: false,
  pagination: defaultSettings,
  isSelectable: null,
  routes: () => null,
  renderEmptyState: () => null,
  filterConfig: []
};
