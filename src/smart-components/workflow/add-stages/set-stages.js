import React, { Fragment, useState } from 'react';
import { Title } from '@patternfly/react-core';
import { FormSelect, FormSelectOption } from '@patternfly/react-core';
import PropTypes from 'prop-types';

const SetStages = (formData, onHandleChange, options) => {
  const [ isExpanded, setExpanded ] = useState(false);
  const [ selected, setSelected ] = useState(undefined);

  const onToggle = (isExpanded) => {
    setExpanded(isExpanded);
  };

  const onChange = (value, event) => {
    setSelected(value);
    onHandleChange({ wfgroups: [ value ]});
    console.log('selected:', value, event);
  };

  return (
    <Fragment>
      <Title size="sm" style={ { paddingLeft: '32px' } }> Set stages </Title>
      <FormSelect
        aria-label="Select stage"
        onToggle={ onToggle }
        onChange={ onChange }
        value={ selected }
        isExpanded={ isExpanded }
        ariaLabelledBy={ 'Stage' }
      >
        { options.map((option) => (
          <FormSelectOption
            isDisabled={ option.disabled }
            key={ option.value || option.label }
            label={ option.label.toString() }
            value={ option.value }
            isPlaceholder={ option.isPlaceholder }
          />
        )) }
      </FormSelect>
    </Fragment>
  );
};

SetStages.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string
};

export default SetStages;
