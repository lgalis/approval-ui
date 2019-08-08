import React, { Fragment, useState } from 'react';
import { PlusIcon, TrashIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import { Button,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Grid,
  GridItem,
  Stack,
  StackItem,
  Title
} from '@patternfly/react-core';

const SetStages = ({ formData, handleChange, options, title }) => {

  const [ isExpanded, setExpanded ] = useState(false);
  const [ stageValues, setStageValues ] = useState(formData.wfGroups ? formData.wfGroups : []);
  const [ stageIndex, setStageIndex ] = useState(formData.wfGroups ? formData.wfGroups.length : 1);

  const onToggle = (isExpanded) => {
    setExpanded(isExpanded);
  };

  const onStageChange = (value, index) => {
    let values = stageValues;
    values[index] = value;
    setStageValues(values);
    handleChange({ wfGroups: values });
  };

  const addStage = () => {
    setStageValues([ ...stageValues, undefined ]);
    setStageIndex(stageIndex + 1);
  };

  const removeStage = (idx) => {
    const i = parseInt(idx.target.id);
    const values = [ ...stageValues.filter((_, j) => i !== j) ];
    setStageValues(values);
    setStageIndex(stageIndex - 1);
    handleChange({ wfGroups: values });
  };

  const createStageInput = (idx) => {
    return (
      <StackItem>
        <FormGroup
          label={ `Stage ${idx + 1}` }
          fieldId={ `${idx + 1}_stage_label` }
        >
          <Grid gutter="md">
            <GridItem span={ 8 }>
              <FormSelect
                label={ `${idx + 1} Stage` }
                aria-label={ `${idx + 1} Stage` }
                onToggle={ onToggle }
                key={ `stage-${idx + 1}` }
                onChange={ (e) => onStageChange(e, idx) }
                value={ stageValues[idx] }
                isexpanded={ isExpanded }
                aria-labelledby={ `Stage-${idx}` }
              >
                { options.map((option) => (
                  <FormSelectOption
                    isdisabled={ option.disabled }
                    key={ option.value || option.label }
                    label={ option.label.toString() }
                    value={ option.value }
                    isplaceholder={ option.isPlaceholder }
                  />
                )) }
              </FormSelect>
            </GridItem>
            <GridItem span={ 1 }>
              { idx > 0 && <Button variant="link" isInline key={ idx } id={ idx } onClick={ removeStage }>
                <TrashIcon/> { 'Remove' }
              </Button> }
            </GridItem>
          </Grid>
        </FormGroup>
      </StackItem>);
  };

  return (
    <Fragment>
      <Stack gutter="md">
        <StackItem>
          <Title size="md">{ title || 'Set stages' }</Title>
        </StackItem>
        <StackItem>
          <Stack gutter="sm">
            { stageValues.map((stage, idx) => createStageInput(idx)) }
            <StackItem style={ { borderTop: 10 } }>
              <Button variant="link" isInline onClick={ addStage }>
                <PlusIcon/> { 'Add another stage' }
              </Button>
            </StackItem>
          </Stack>
        </StackItem>
      </Stack>
    </Fragment>
  );
};

SetStages.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
  formData: PropTypes.object,
  options: PropTypes.array,
  handleChange: PropTypes.func.required
};

export default SetStages;
