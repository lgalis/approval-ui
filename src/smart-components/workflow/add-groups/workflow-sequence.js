import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  FormGroup,
  Stack,
  StackItem,
  TextInput,
  Title
} from '@patternfly/react-core';

const WorkflowSequence = ({ formData, handleChange, isValid, setIsValid, title = undefined }) => {
  const { sequence } = formData;

  const handleSequenceChange = (sequence) => {
    setIsValid(sequence >= 0);
    handleChange({ sequence });
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
              label="Enter sequence"
              isRequired
              fieldId="workflow-sequence"
              isValid={ isValid }
              helperTextInvalid={ 'Enter a positive number' }
            >
              <TextInput
                isRequired
                type="number"
                id="workflow-sequence"
                isValid={ isValid }
                name="workflow-sequence"
                aria-describedby="workflow-name"
                value={ sequence }
                onChange={ (_, event) => handleSequenceChange(event.currentTarget.value) }
              />
            </FormGroup>
          </Form>
        </StackItem>
      </Stack>
    </Fragment>
  );
};

WorkflowSequence.propTypes = {
  sequence: PropTypes.string,
  title: PropTypes.string,
  formData: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
  setIsValid: PropTypes.func.isRequired,
  isValid: PropTypes.bool
};

export default WorkflowSequence;
