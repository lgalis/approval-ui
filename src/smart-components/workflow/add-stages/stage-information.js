import React, { Fragment } from 'react';
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

const StageInformation = (formValue, onHandleChange) => {
  return (
    <Fragment>
      <Stack gutter="md">
        <StackItem>
          <Title size="xl"> Enter your information </Title>
        </StackItem>
        <StackItem>
          <Form>
            <FormGroup
              label="Workflow name"
              isRequired
              fieldId="workflow-name"
            >
              <TextInput
                isRequired
                type="text"
                id="workflow-name"
                name="workflow-name"
                aria-describedby="workflow-name"
                value={ formValue.name }
                onChange={ (_, event) => onHandleChange({ name: event.currentTarget.value }) }
              />
            </FormGroup>
            <FormGroup label="Description" fieldId="workflow-description">
              <TextArea
                type="text"
                id="workflow-description"
                name="workflow-description"
                value={ formValue.description }
                onChange={ (_, event) => onHandleChange({ description: event.currentTarget.value }) }
              />
            </FormGroup>
          </Form>
        </StackItem>
      </Stack>
    </Fragment>
  );
};

StageInformation.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string
};

export default StageInformation;
