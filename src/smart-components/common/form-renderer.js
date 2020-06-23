import React from 'react';
import PropTypes from 'prop-types';

import ReactFormRender from '@data-driven-forms/react-form-renderer/dist/cjs/form-renderer';
import componentMapper from '@data-driven-forms/pf4-component-mapper/dist/cjs/component-mapper';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';

import SummaryContent from '../workflow/add-groups/summary-content';

const componentMapperExtended = {
  ...componentMapper,
  summary: SummaryContent
};

const FormRenderer = ({ formContainer, ...rest }) => (
  <ReactFormRender
    componentMapper={ componentMapperExtended }
    FormTemplate={ (props) => <FormTemplate { ...props }/> }
    { ...rest }
  />
);

FormRenderer.propTypes = {
  formContainer: PropTypes.oneOf([ 'default', 'modal' ])
};

FormRenderer.defaultProps = {
  formContainer: 'default'
};

export default FormRenderer;
