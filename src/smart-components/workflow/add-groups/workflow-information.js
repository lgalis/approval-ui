import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  FormGroup,
  Stack,
  StackItem,
  TextInput,
  TextArea,
  Title
} from '@patternfly/react-core';
import asyncDebounce from '../../../utilities/async-debounce';
import { fetchWorkflowByName } from '../../../helpers/workflow/workflow-helper';

const validateName = (name) => fetchWorkflowByName(name)
.then(({ data }) => {
  return data.find(wf => name === wf.name)
    ? 'Name has already been taken'
    : undefined;
});

const debouncedValidator = (data, validateCallback) => asyncDebounce(validateName(data).then((result) => validateCallback(result)));

const WorkflowInfoForm = ({ formData, initialValue, handleChange, setIsValid, title = undefined }) => {
  const name = formData.name || '';
  const description = formData.description || '';
  const [ error, setError ] = useState(undefined);

  const setResult = (result) => {
    setError(result);
    setIsValid(!result);
  };

  const onHandleChange = (name) => {
    setError(!name || name.length < 1 ? 'Enter a name for the approval process' : undefined);
    handleChange({ name });
  };

  const handleNameChange = (name) => {
    if (!name || name.length < 1) {
      setError('Enter a name for the approval process');
    }
    else if (!initialValue || initialValue.name !== name) {
      debouncedValidator(name, setResult);
    }
    else {
      setError(undefined);
    }
  };

  return (
    <Fragment>
      <Stack gutter="md">
        <StackItem>
          <Title size="md"> { title || 'Enter your information' } </Title>
        </StackItem>
        <StackItem>
          <Form>
            <FormGroup
              label="Approval process name"
              isRequired
              fieldId="workflow-name"
              isValid={ !error }
              helperTextInvalid={ error }
            >
              <TextInput
                isRequired
                type="text"
                id="workflow-name"
                name="workflow-name"
                aria-describedby="workflow-name"
                value={ name }
                isValid={ !error }
                onBlur={ () => handleNameChange(name) }
                onChange={ (_, event) => onHandleChange(event.currentTarget.value) }
              />
            </FormGroup>
            <FormGroup label="Description" fieldId="workflow-description">
              <TextArea
                type="text"
                id="workflow-description"
                name="workflow-description"
                value={ description }
                onChange={ (_, event) => handleChange({ description: event.currentTarget.value }) }
              />
            </FormGroup>
          </Form>
        </StackItem>
      </Stack>
    </Fragment>
  );
};

WorkflowInfoForm.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
  formData: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
  isValid: PropTypes.bool,
  setIsValid: PropTypes.func.isRequired,
  initialValue: PropTypes.shape({
    name: PropTypes.string })
};

export default WorkflowInfoForm;