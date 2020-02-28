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

const WorkflowInfoForm = ({ formData, initialValue, handleChange, isValid, title = undefined }) => {
  const { name, description } = formData;
  const [ error, setError ] = useState(undefined);

  const validateName = (name) => fetchWorkflowByName(name)
  .then(({ data }) => {
    return data.find(wf => name === wf.name)
      ? 'Name has already been taken'
      : undefined;
  });

  const setResult = (result) => {
    setError(result);
    isValid(!result);
  };

  const debouncedValidator = (data, validateCallback) => asyncDebounce(validateName(data.name).then((result) => validateCallback(result)));

  const handleNameChange = () => {
    if (!initialValue || initialValue.name !== formData.name) {
      debouncedValidator(formData, setResult);
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
              isValid={ !error && isValid() }
              helperTextInvalid={ error || 'Enter a name for the approval process' }
            >
              <TextInput
                isRequired
                type="text"
                id="workflow-name"
                name="workflow-name"
                aria-describedby="workflow-name"
                value={ name }
                isValid={ !error && isValid() }
                onBlur={ handleNameChange }
                onChange={ (_, event) => { setError(undefined); handleChange({ name: event.currentTarget.value }); } }
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
  isValid: PropTypes.func.isRequired,
  initialValue: PropTypes.shape({
    name: PropTypes.string })
};

export default WorkflowInfoForm;
