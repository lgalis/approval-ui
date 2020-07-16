import React from 'react';
import { Title } from '@patternfly/react-core';

import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';

import workflowInfoSchema from './workflow-info.schema';
import setGroupSelectSchema from './set-group-select.schema';

import formMessages from '../messages/form.messages';

const addWorkflowSchema = (intl) => ({
  fields: [{
    name: 'wizard',
    title: intl.formatMessage(formMessages.createApprovalTitle),
    component: componentTypes.WIZARD,
    inModal: true,
    fields: [{
      name: 'general-information',
      showTitle: true,
      customTitle: <Title headingLevel="h1" size="md"> { intl.formatMessage(formMessages.enterInfo) } </Title>,
      title: intl.formatMessage(formMessages.generalInformation),
      nextStep: 'set-groups',
      fields: workflowInfoSchema(intl)
    }, {
      name: 'set-groups',
      nextStep: 'review',
      title: intl.formatMessage(formMessages.setGroups),
      fields: [ setGroupSelectSchema(intl) ]
    }, {
      name: 'review',
      title: intl.formatMessage(formMessages.review),
      fields: [{
        name: 'summary',
        component: 'summary'
      }]
    }]
  }]
});

export default addWorkflowSchema;
