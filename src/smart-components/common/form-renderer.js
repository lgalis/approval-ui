import React from 'react';
import PropTypes from 'prop-types';
import ReactFormRender from '@data-driven-forms/react-form-renderer/dist/cjs/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';

import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';
import Select from '@data-driven-forms/pf4-component-mapper/dist/cjs/select';
import Textarea from '@data-driven-forms/pf4-component-mapper/dist/cjs/textarea';
import TextField from '@data-driven-forms/pf4-component-mapper/dist/cjs/text-field';
import SubForm from '@data-driven-forms/pf4-component-mapper/dist/cjs/sub-form';
import { FormButtons } from './form-buttons';

const FormRenderer = ({ formTemplateProps, ...rest }) => {
  return <ReactFormRender
    componentMapper={ {
      [componentTypes.SELECT]: Select,
      [componentTypes.TEXTAREA]: Textarea,
      [componentTypes.TEXT_FIELD]: TextField,
      [componentTypes.SUB_FORM]: SubForm
    } }
    FormTemplate={ (props) => <FormTemplate { ...formTemplateProps } { ...props }
      FormButtons={ FormButtons }/> }
    { ...rest }
  />;
};

FormRenderer.propTypes = {
  formTemplateProps: PropTypes.object
};

export default FormRenderer;
