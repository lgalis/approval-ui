import React from 'react';
import PropTypes from 'prop-types';
import FormRenderer from '../common/form-renderer';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, Stack, Text, TextContent, TextVariants, Title } from '@patternfly/react-core';
import { createRequestAction } from '../../redux/actions/request-actions';
import { createRequestCommentSchema } from '../../forms/request-comment-form.schema';
import useQuery from '../../utilities/use-query';
import routes from '../../constants/routes';
import { useIntl } from 'react-intl';
import actionModalMessages from '../../messages/action-modal.messages';
import requestsMessages from '../../messages/requests.messages';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';

const actionTypeToDescription = (type) => {
  switch (type) {
    case 'Approve':
      return requestsMessages.approveDescription;
    case 'Deny':
      return requestsMessages.denyDescription;
    default:
      return requestsMessages.commentDescription;
  }
};

const actionTypeToTitle = (type) => {
  switch (type) {
    case 'Approve':
      return requestsMessages.approveTitle;
    case 'Deny':
      return requestsMessages.denyTitle;
    default:
      return requestsMessages.addCommentTitle;
  }
};

const actionTypeToSubmitLabel = (type) => {
  console.log ('Debug - type', type, requestsMessages.approveLabel, requestsMessages.denyLabel, requestsMessages.approveLabel);
  switch (type) {
    case 'Approve':
      return requestsMessages.approveLabel;
    case 'Deny':
      return requestsMessages.denyLabel;
    default:
      return requestsMessages.addCommentLabel;
  }
};

const ActionModal = ({
  actionType,
  createRequestAction,
  closeUrl,
  postMethod
}) => {
  const intl = useIntl();
  const { push } = useHistory();
  const [{ request: id }] = useQuery([ 'request' ]);
  const onSubmit = (data) => {
    const operationType = { 'Add Comment': 'memo', Approve: 'approve', Deny: 'deny' };
    const actionName = actionType === 'Add Comment'
      ? intl.formatMessage(requestsMessages.addCommentTitle)
      : intl.formatMessage(actionModalMessages.actionName, { actionType: intl.formatMessage(actionTypeToTitle(actionType)) }) ;

    return postMethod ?
      createRequestAction(
        actionName,
        id,
        { operation: operationType[actionType], ...data },
        intl
      ).then(() => postMethod()).then(() => push(closeUrl))
      : createRequestAction(
        actionName,
        id,
        { operation: operationType[actionType], ...data },
        intl
      ).then(() => push(closeUrl));
  };

  const onCancel = () => push(closeUrl);

  return (
    <Modal
      variant="small"
      header={
        <Title size="lg" headingLevel="h1">
          { actionType === 'Deny' && <ExclamationTriangleIcon size="sm" fill="#f0ab00" className="pf-u-mr-sm" /> }
          { intl.formatMessage(actionTypeToTitle(actionType)) }
        </Title>
      }
      isOpen
      onClose={ onCancel }
    >
      <Stack hasGutter>
        <TextContent>
          <Text component={ TextVariants.small }>
            { intl.formatMessage(actionModalMessages.requestActionDescription,
              { id, actionMessage: intl.formatMessage(actionTypeToDescription(actionType)) }) }
          </Text>
        </TextContent>

        <FormRenderer
          schema={ createRequestCommentSchema(actionType === 'Deny', intl) }
          onSubmit={ onSubmit }
          onCancel={ onCancel }
          FormTemplate={ (props) => <FormTemplate
            { ...props }
            templateProps={ { submitLabel: intl.formatMessage(actionTypeToSubmitLabel(actionType)) } }
          /> }
        />
      </Stack>
    </Modal>
  );
};

ActionModal.defaultProps = {
  closeUrl: routes.requests.index
};

ActionModal.propTypes = {
  createRequestAction: PropTypes.func.isRequired,
  postMethod: PropTypes.func,
  actionType: PropTypes.string,
  closeUrl: PropTypes.oneOfType([ PropTypes.string, PropTypes.shape({ patname: PropTypes.string, search: PropTypes.string }) ])
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createRequestAction
}, dispatch);

export default connect(null, mapDispatchToProps)(ActionModal);
