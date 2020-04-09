import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import ReactFormRender, {
  componentTypes,
  layoutComponents
} from '@data-driven-forms/react-form-renderer';
import {
  layoutMapper,
  formFieldsMapper
} from '@data-driven-forms/pf4-component-mapper';
import Pf4SelectWrapper from '../../presentational-components/shared/pf4-select-wrapper';
import GroupSelect from '../../forms/form-fields/group-select';

const FormContext = createContext({});

const FormButton = ({ label, variant, ...props }) => {
  const { formContainer } = useContext(FormContext);
  return (
    <Button
      { ...props }
      variant={
        formContainer === 'modal' && variant === undefined ? 'link' : variant
      }
    >
      { label }
    </Button>
  );
};

FormButton.propTypes = {
  label: PropTypes.string.isRequired,
  variant: PropTypes.string
};

const FormRenderer = ({ componentMapper, formContainer, ...rest }) => {
  return (
    <div>
      <FormContext.Provider value={ { formContainer } }>
        <ReactFormRender
          formFieldsMapper={ {
            ...formFieldsMapper,
            ...componentMapper,
            [componentTypes.SELECT]: Pf4SelectWrapper,
            'group-select': GroupSelect
          } }
          layoutMapper={ {
            ...layoutMapper,
            [layoutComponents.BUTTON]: FormButton
          } }
          { ...rest }
        />
      </FormContext.Provider>
    </div>
  );
};

FormRenderer.propTypes = {
  componentMapper: PropTypes.object,
  formContainer: PropTypes.oneOf([ 'default', 'modal' ])
};

FormRenderer.defaultProps = {
  componentMapper: {},
  formContainer: 'default'
};

export default FormRenderer;
