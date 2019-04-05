import React from 'react';
import PropTypes from 'prop-types';
import FilterToolbarItem from '../shared/FilterToolbarItem';
import '../shared/toolbarschema.scss';

const WorkflowsFilterToolbar = ({ onFilterChange, filterValue, ...props }) => (
  <FilterToolbarItem { ...props } searchValue={ filterValue } onFilterChange={ onFilterChange } placeholder={ 'Find a Workflow' }/>
);

WorkflowsFilterToolbar.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  filterValue: PropTypes.string
};

export default WorkflowsFilterToolbar;
