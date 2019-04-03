import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import FormRenderer from '../common/form-renderer';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, Grid, GridItem, TextContent, Text, TextVariants } from '@patternfly/react-core';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { fetchRequests } from '../../redux/actions/request-actions';

const AddRequestModal = ({
  history: { goBack },
  addNotification,
  fetchRequests,
  initialValues,
  workflows,
  updateRequest
}) => {
  const onSubmit = data => {
    updateRequest(data).then(() => fetchRequests()).then(goBack);
  };

  const onCancel = () => {
    addNotification({
      variant: 'warning',
      title: 'Editing request',
      description: 'Edit request was cancelled by the user.'
    });
    goBack();
  };

  const onOptionSelect = () =>
  { };

  const dropdownItems = workflows.map(workflow => ({ value: workflow.id, label: workflow.name, id: workflow.id }));

  const schema = {
    type: 'object',
    properties: {
      email: { title: initialValues ? 'Email' : 'New Email', type: 'string' },
      first_name: { title: 'First Name', type: 'string' },
      last_name: { title: 'Last Name', type: 'string' }
    },
    required: [ 'email' ]
  };

  return (
    <Modal
      isLarge
      title={ initialValues ? 'Update approver' : 'Create approver' }
      isOpen
      onClose={ onCancel }
    >
      <Grid gutter="md" style={ { minWidth: '800px' } }>
        <GridItem sm={ 6 }>
          <FormRenderer
            schema={ schema }
            schemaType="mozilla"
            onSubmit={ onSubmit }
            onCancel={ onCancel }
            formContainer="modal"
            initialValues={ { ...initialValues } }
          />
        </GridItem>
        <GridItem sm={ 6 }>
          <TextContent>
            <Text component={ TextVariants.h6 }>Select the workflows for this request.</Text>
          </TextContent>
          <Select
            isMulti={ true }
            placeholders={ 'Select workflows' }
            options={ dropdownItems }
            onChange={ onOptionSelect }
            closeMenuOnSelect={ false }
          />
        </GridItem>
      </Grid>
    </Modal>
  );
};

AddRequestModal.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
  fetchRequests: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  workflows: PropTypes.array,
  updateRequest: PropTypes.func.isRequired
};

const mapStateToProps = (state, { match: { params: { id }}}) => {
  let requests = state.requestReducer.requests;
  return {
    workflows: state.workflowReducer.workflows,
    initialValues: id && requests.find(item => item.id === id),
    requestId: id
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  fetchRequests
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddRequestModal));
