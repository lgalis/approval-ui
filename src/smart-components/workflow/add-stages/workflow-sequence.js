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

const WorkflowSequence = ({ formData, handleChange, title = undefined }) => {
  const { sequence } = formData;

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
            >
              <TextInput
                isRequired
                type="number"
                id="workflow-sequence"
                name="workflow-sequence"
                aria-describedby="workflow-name"
                value={ sequence }
                onChange={ (_, event) => handleChange({ sequence: event.currentTarget.value }) }
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
  handleChange: PropTypes.func.isRequired
};

export default WorkflowSequence;
