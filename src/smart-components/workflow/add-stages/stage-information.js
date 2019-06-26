import React, { Fragment } from 'react';
import { Title } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import {
  Form,
  FormGroup,
  TextInput,
  TextArea
} from '@patternfly/react-core';

const StageInformation = (formValue, onHandleChange) => {
  return (
    <Fragment>
      <Title size="sm" style={ { paddingLeft: '32px' } }> Set stages </Title>
      <Form>
        <FormGroup
          label="Name"
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
            onChange={ onHandleChange }
          />
        </FormGroup>
        <FormGroup label="Description" fieldId="workflow-description">
          <TextArea
            type="text"
            id="workflow-description"
            name="workflow-description"
            value={ formValue.description }
            onChange={ onHandleChange }
          />
        </FormGroup>
      </Form>
    </Fragment>
  );
};

StageInformation.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string
};

export default StageInformation;
