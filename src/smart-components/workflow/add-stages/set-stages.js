import React, { Fragment, useState } from 'react';
import { Title } from '@patternfly/react-core';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import PropTypes from 'prop-types';

const SetStages = (formData, onHandleChange, options) => {
  const [ isExpanded, setExpanded ] = useState(false);
  const [ selected, setSelected ] = useState(undefined);

  const onToggle = (isExpanded) => {
    setExpanded(isExpanded);
  };

  const clearSelection = () => {
    setSelected(null);
    setExpanded(false);
  };

  const onSelect = (event, selection, isPlaceholder) => {
    if (isPlaceholder) {
      clearSelection();
    }
    else {
      setSelected(selection);
      setExpanded(false);
    }

    onHandleChange(selected);
    console.log('selected:', selection);
  };

  return (
    <Fragment>
      <Title size="sm" style={ { paddingLeft: '32px' } }> Set stages </Title>
      <Select
        variant={ SelectVariant.single }
        aria-label="Select stage"
        onToggle={ onToggle }
        onSelect={ onSelect }
        selections={ selected }
        isExpanded={ isExpanded }
        ariaLabelledBy={ 'Stage' }
      >
        { options.map((option, index) => (
          <SelectOption
            isDisabled={ option.disabled }
            key={ index }
            value={ option.value }
            isPlaceholder={ option.isPlaceholder }
          />
        )) }
      </Select>
    </Fragment>
  );
};

SetStages.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string
};

export default SetStages;
