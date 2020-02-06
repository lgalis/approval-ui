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

const StageInformation = ({ formData, handleChange, title = undefined }) => {
  const { name, description } = formData;

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
            >
              <TextInput
                isRequired
                type="text"
                id="workflow-name"
                name="workflow-name"
                aria-describedby="workflow-name"
                value={ name }
                onChange={ (_, event) => handleChange({ name: event.currentTarget.value }) }
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

StageInformation.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
  formData: PropTypes.object,
  handleChange: PropTypes.func.isRequired
};

export default StageInformation;
