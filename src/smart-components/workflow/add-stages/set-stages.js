import React, { Fragment, useState } from 'react';
import { Title, FormSelect, FormSelectOption, Button } from '@patternfly/react-core';
import { PlusIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';

const SetStages = (formData, onHandleChange, options) => {
  const [ isExpanded, setExpanded ] = useState(false);
  const [ stageValues, setStageValues ] = useState([]);
  const [ stageIndex, setStageIndex ] = useState(1);

  const onToggle = (isExpanded) => {
    setExpanded(isExpanded);
  };

  const onChange = ( event, value) => {
    setStageValues(...stageValues, value);
    onHandleChange({ [`stage-#{event.key}`]: value });

    console.log('selected:', stageValues, value, event);
  };

  const createStageInput = (idx) => {
    return (
      <FormSelect
        label={ `${idx + 1} Stage` }
        aria-label= { `${idx + 1} Stage` }
        onToggle={ onToggle }
        key = { `stage-${idx + 1}` }
        onChange={ (e) => onChange(e, idx) }
        value={ stageValues[idx] }
        isExpanded={ isExpanded }
        ariaLabelledBy={ `Stage-${idx}` }
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
      </FormSelect>);
  };

  const [ stageSchema, setStageSchema ] = useState([ (createStageInput(0)) ]);

  const addStageSchema = () => {
    setStageSchema([ ...stageSchema, createStageInput(stageIndex + 1) ]);
    setStageIndex(stageIndex + 1);
  };

  return (
    <Fragment>
      <Title size="md"> Set stages </Title>
      { stageSchema.map((stage, idx) => createStageInput(idx)) }
      <Button variant="link" isInline onClick={ addStageSchema }>
        <PlusIcon/> { 'Add a stage' }
      </Button>
    </Fragment>
  );
};

SetStages.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string
};

export default SetStages;
