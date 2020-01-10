import React from 'react';
import PropTypes from 'prop-types';
import { SearchIcon, CloseIcon } from '@patternfly/react-icons';
import { ToolbarItem, TextInput } from '@patternfly/react-core';

const FilterToolbarItem = ({
  searchValue,
  onFilterChange,
  placeholder,
  isClearable
}) => (
  <ToolbarItem>
    <div className="toolbar-filter-input-group">
      <TextInput
        placeholder={ placeholder }
        value={ searchValue }
        type="text"
        onChange={ onFilterChange }
        aria-label={ placeholder }
      />
      <span className="filter-icons-container">
        { (isClearable && searchValue && (
          <CloseIcon
            className="clear-filter"
            width="16"
            height="16"
            onClick={ () => onFilterChange('') }
          />
        )) || <SearchIcon /> }
      </span>
    </div>
  </ToolbarItem>
);

FilterToolbarItem.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  searchValue: PropTypes.string,
  isClearable: PropTypes.bool
};

FilterToolbarItem.defaultProps = {
  searchValue: '',
  isClearable: false
};

export default FilterToolbarItem;
