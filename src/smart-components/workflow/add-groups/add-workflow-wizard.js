import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { addWorkflow, refreshWorkflows } from '../../../redux/actions/workflow-actions';
import routes from '../../../constants/routes';
import FormRenderer from '../../common/form-renderer';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import { fetchWorkflowByName } from '../../../helpers/workflow/workflow-helper';
import asyncDebounce from '../../../utilities/async-debounce';
import { fetchFilterApprovalGroups } from '../../../helpers/group/group-helper';
import { Title } from '@patternfly/react-core';

const validateName = (name) => fetchWorkflowByName(name)
.then(({ data }) => {
  return data.find(wf => name === wf.name)
    ? 'Name has already been taken'
    : undefined;
});

const debouncedValidator = asyncDebounce(validateName);

const AddWorkflow = () => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const intl = useIntl();

  const onSave = ({ name, description, wfGroups }) => {
    const workflowData = { name, description,
      group_refs: wfGroups && wfGroups.length > 0 ? wfGroups.map(group => ({ name: group.label, uuid: group.value })) : []};
    push(routes.workflows.index);
    return dispatch(addWorkflow(workflowData)).then(() => dispatch(refreshWorkflows()));
  };

  const onCancel = () => {
    dispatch(addNotification({
      variant: 'warning',
      title: 'Creating approval process',
      dismissable: true,
      description: 'Creating approval process was cancelled by the user.'
    }));
    push(routes.workflows.index);
  };

  return (
    <FormRenderer
      showFormControls={ false }
      onSubmit={ onSave }
      onCancel={ onCancel }
      schema={ {
        fields: [{
          name: 'wizard',
          title: intl.formatMessage({
            id: 'create-approval-process-title',
            defaultMessage: 'Create approval procces'
          }),
          component: componentTypes.WIZARD,
          inModal: true,
          fields: [{
            name: 'general-information',
            showTitle: true,
            customTitle: <Title size="md"> { <FormattedMessage id="enter-info" defaultMessage="Enter your information" /> } </Title>,
            title: intl.formatMessage({
              id: 'create-approval-process-gen-info',
              defaultMessage: 'General info'
            }),
            nextStep: 'set-groups',
            fields: [{
              component: componentTypes.TEXT_FIELD,
              name: 'name',
              isRequired: true,
              label: intl.formatMessage({
                id: 'create-approval-process-name-label',
                defaultMessage: 'Approval process name'
              }),
              validate: [
                (value) => debouncedValidator(value),
                {
                  type: validatorTypes.REQUIRED,
                  message: intl.formatMessage({
                    id: 'approval-procces-name-warning',
                    defaultMessage: 'Enter a name for the approval process'
                  })
                }]
            }, {
              component: componentTypes.TEXTAREA,
              name: 'description',
              label: intl.formatMessage({
                id: 'create-approval-process-description-label',
                defaultMessage: 'Description'
              })
            }]
          }, {
            name: 'set-groups',
            nextStep: 'review',
            title: intl.formatMessage({
              id: 'create-approval-process-set-groups',
              defaultMessage: 'Set groups'
            }),
            fields: [{
              component: componentTypes.SELECT,
              name: 'wfGroups',
              label: intl.formatMessage({
                id: 'create-approval-process-set-groups',
                defaultMessage: 'Set groups'
              }),
              loadOptions: asyncDebounce(fetchFilterApprovalGroups),
              isMulti: true,
              isSearchable: true,
              simpleValue: false
            }]
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
      } }
    />
  );
};

AddWorkflow.defaultProps = {
  rbacGroups: [],
  initialValues: {}
};

AddWorkflow.propTypes = {
  match: PropTypes.object,
  rbacGroups: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]).isRequired,
    label: PropTypes.string.isRequired
  })).isRequired
};

export default AddWorkflow;
