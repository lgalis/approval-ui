import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import { Modal, Button, Bullseye, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { removeWorkflow, removeWorkflows } from '../../redux/actions/workflow-actions';

const RemoveWorkflowModal = ({
  history: { goBack, push },
  match: { params: { id: workflowId  }},
  ids,
  removeWorkflow,
  removeWorkflows,
  fetchData,
  setSelectedWorkflows
}) => {
  if (!workflowId && (!ids || ids.length === 0)) {
    return null;
  }

  const onSubmit = () => { return ((workflowId ? removeWorkflow(workflowId) : removeWorkflows(ids))
  .then(setSelectedWorkflows([])).then(fetchData()).then(push('/workflows')));
  };

  const onCancel = () => goBack();

  return (
    <Modal
      isOpen
      isSmall
      width={ '40%' }
      title={ '' }
      onClose={ onCancel }
      actions={ [
        <Button id="cancel-remove-workflow" key="cancel" variant="secondary" type="button" onClick={ onCancel }>
          Cancel
        </Button>,
        <Button id="submit-remove-workflow" key="submit" variant="primary" type="button" onClick={ onSubmit }>
          Confirm
        </Button>
      ] }
    >
      <Bullseye>
        <TextContent>
          <Text component={ TextVariants.h1 }>
            <FormattedMessage
              id="remove-workflow-modal"
              defaultMessage={ `Removing {count, number} {count, plural,
              one {workflow}
              other {workflows}
            }` }
              values={ {
                count: workflowId !== undefined ? 1 : ids.length
              } }
            />
          </Text>
        </TextContent>
      </Bullseye>
    </Modal>
  );
};

RemoveWorkflowModal.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.object,
  removeWorkflows: PropTypes.func.isRequired,
  removeWorkflow: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  setSelectedWorkflows: PropTypes.func.isRequired,
  workflowId: PropTypes.string,
  ids: PropTypes.array
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  removeWorkflow,
  removeWorkflows
}, dispatch);

export default withRouter(connect(null, mapDispatchToProps)(RemoveWorkflowModal));
