import React from 'react';
import PropTypes from 'prop-types';
import ReactFormRender from '@data-driven-forms/react-form-renderer/dist/cjs/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';

import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';
import Select from '@data-driven-forms/pf4-component-mapper/dist/cjs/select';
import Textarea from '@data-driven-forms/pf4-component-mapper/dist/cjs/textarea';
import TextField from '@data-driven-forms/pf4-component-mapper/dist/cjs/text-field';
import SubForm from '@data-driven-forms/pf4-component-mapper/dist/cjs/sub-form';
import InitialChips from '../../forms/initial-chips';

const FormRenderer = ({
  templateProps,
  ...rest
}) => {
  return (
    <div>
      <ReactFormRender
        componentMapper={ {
          [componentTypes.SELECT]: Select,
          [componentTypes.TEXTAREA]: Textarea,
          [componentTypes.TEXT_FIELD]: TextField,
          [componentTypes.SUB_FORM]: SubForm,
          'initial-chips': InitialChips
        } }
        FormTemplate={ (props) => (
          <FormTemplate
            { ...props }
            { ...templateProps }
          />
        ) }
        { ...rest }
      />
    </div>
  );
};

FormRenderer.propTypes = {
  templateProps: PropTypes.object,
  schema: PropTypes.object
};

export default FormRenderer;
