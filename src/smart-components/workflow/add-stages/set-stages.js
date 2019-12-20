import React, { Fragment, useState, useEffect } from 'react';
import { PlusIcon, TrashIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/async';
import asyncDebounce from '../../../utilities/async-debounce';
import { fetchFilterGroups } from '../../../helpers/group/group-helper';
import { WorkflowStageLoader } from '../../../presentational-components/shared/loader-placeholders';
import { useDispatch, useSelector } from 'react-redux';
import { Button,
  FormGroup,
  Grid,
  GridItem,
  Stack,
  StackItem,
  Title
} from '@patternfly/react-core';
import { fetchRbacGroups } from '../../../redux/actions/group-actions';

const SetStages = ({ formData, handleChange, title }) => {
  const [ isExpanded, setExpanded ] = useState(false);
  const [ stageValues, setStageValues ] = useState([]);
  const [ stageIndex, setStageIndex ] = useState(1);
  const [ inputValue, setInputValue ] = useState([]);
  const [ isFetching, setIsFetching ] = useState([]);

  const defaultOptions = useSelector(({ groupReducer: { groups }}) => groups || []);

  const onInputChange = (newValue) => {
    const value = newValue.replace(/\W/g, '');
    setInputValue(value);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    setIsFetching(true);
    dispatch(
      fetchRbacGroups()).then(() => setIsFetching(false));
  }, []);

  useEffect(() => {
    setStageValues(formData.wfGroups ? formData.wfGroups : []);
    setStageIndex(formData.wfGroups ? formData.wfGroups.length : 1);
  }, [ formData.wfGroups ]);

  const onToggle = (isExpanded) => {
    setExpanded(isExpanded);
  };

  const onStageChange = (value, index) => {
    const values = stageValues;
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

  const loadGroupOptions = (inputValue) => fetchFilterGroups(inputValue);

  const createStageInput = (idx) => (
    <StackItem key={ `Stack_${idx + 1}` }>
      <FormGroup
        label={ `Group ${idx + 1}` }
        fieldId={ `${idx + 1}_stage_label` }
      >
        <Grid gutter="md">
          <GridItem span={ 8 }>
            <AsyncSelect
              cacheOptions
              isClearable
              label={ `${idx + 1} Group` }
              aria-label={ `${idx + 1} Group` }
              onToggle={ onToggle }
              key={ `stage-${idx + 1}` }
              onChange={ (e) => onStageChange(e, idx) }
              value={ stageValues[idx] }
              inpuValue={ inputValue }
              isexpanded={ isExpanded }
              loadOptions={ asyncDebounce(loadGroupOptions) }
              defaultOptions={ defaultOptions }
              onInputChange={ (e) => onInputChange(e, idx) }
            />
          </GridItem>
          <GridItem span={ 1 } style={ { display: 'flex' } }>
            { idx > 0 && <Button variant="link" isInline key={ idx } id={ idx } onClick={ removeStage }>
              <TrashIcon/> { 'Remove' }
            </Button> }
          </GridItem>
        </Grid>
      </FormGroup>
    </StackItem>
  );

  return (
    <Fragment>
      <Stack gutter="md">
        <StackItem>
          <Title size="md">{ title || 'Set groups' }</Title>
        </StackItem>
        <StackItem>
          { isFetching && <WorkflowStageLoader/> }
          { !isFetching &&
          <Stack gutter="sm">
            { stageValues.map((_stage, idx) => createStageInput(idx)) }
            <StackItem style={ { borderTop: 10 } }>
              <Button id="add-workflow-stage" variant="link" isInline onClick={ addStage }>
                <PlusIcon/> { `Add ${ stageValues.length > 0 ? 'another' : 'a'} group` }
              </Button>
            </StackItem>
          </Stack> }
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
  handleChange: PropTypes.func
};

export default SetStages;
