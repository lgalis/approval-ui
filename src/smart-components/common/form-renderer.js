import React from 'react';
import PropTypes from 'prop-types';

import ReactFormRender from '@data-driven-forms/react-form-renderer/dist/cjs/form-renderer';
import componentMapper from '@data-driven-forms/pf4-component-mapper/dist/cjs/component-mapper';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';

import SummaryContent from '../workflow/add-groups/summary-content';

const buttonPositioning = {
  default: {},
  modal: {
    buttonOrder: [ 'cancel', 'reset', 'save' ],
    buttonClassName: 'modal-form-right-align'
  }
};

const componentMapperExtended = {
  ...componentMapper,
  summary: SummaryContent
};

const FormRenderer = ({ formContainer, ...rest }) => (
  <div className={ buttonPositioning[formContainer].buttonClassName }>
    <ReactFormRender
      componentMapper={ componentMapperExtended }
      FormTemplate={ (props) => <FormTemplate { ...props } { ...buttonPositioning[formContainer] }/> }
      { ...rest }
    />
  </div>
);

FormRenderer.propTypes = {
  formContainer: PropTypes.oneOf([ 'default', 'modal' ])
};

FormRenderer.defaultProps = {
  formContainer: 'default'
};

export default FormRenderer;
