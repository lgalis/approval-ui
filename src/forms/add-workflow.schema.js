import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Title } from '@patternfly/react-core';

import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';

import workflowInfoSchema from './workflow-info.schema';
import setGroupSelectSchema from './set-group-select.schema';

const addWorkflowSchema = (intl) => ({
  fields: [{
    name: 'wizard',
    title: intl.formatMessage({
      id: 'create-approval-process-title',
      defaultMessage: 'Create approval process'
    }),
    component: componentTypes.WIZARD,
    inModal: true,
    fields: [{
      name: 'general-information',
      showTitle: true,
      customTitle: <Title headingLevel="h3" size="md"> { <FormattedMessage id="enter-info" defaultMessage="Enter your information" /> } </Title>,
      title: intl.formatMessage({
        id: 'create-approval-process-gen-info',
        defaultMessage: 'General information'
      }),
      nextStep: 'set-groups',
      fields: workflowInfoSchema()
    }, {
      name: 'set-groups',
      nextStep: 'review',
      title: intl.formatMessage({
        id: 'create-approval-process-set-groups',
        defaultMessage: 'Set groups'
      }),
      fields: [ setGroupSelectSchema(intl) ]
    }, {
      name: 'review',
      title: intl.formatMessage({
        id: 'create-approval-process-review',
        defaultMessage: 'Review'
      }),
      fields: [{
        name: 'summary',
        component: 'summary'
      }]
    }]
  }]
});

export default addWorkflowSchema;
