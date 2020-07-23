import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useIsApprovalAdmin, isRequestStateActive } from '../../../helpers/shared/helpers';
import { ActionTranscript } from './action-transcript';

import {
  Stack,
  StackItem,
  Button,
  DataListItem,
  DataListItemRow,
  DataListCell,
  DataListToggle,
  DataListItemCells,
  DataListContent,
  DropdownItem,
  Dropdown,
  DropdownPosition,
  KebabToggle,
  TextVariants,
  TextContent,
  Level,
  LevelItem
} from '@patternfly/react-core';
import UserContext from '../../../user-context';
import routes from '../../../constants/routes';
import { useIntl } from 'react-intl';
import requestsMessages from '../../../messages/requests.messages';
import commonMessages from '../../../messages/common.message';
import { untranslatedMessage } from '../../../utilities/constants';
import RequestActions from '../request-actions';

export const Request = ({ item, isExpanded, toggleExpand, indexpath }) => {
  const [ isKebabOpen, setIsKebabOpen ] = useState(false);
  const { userRoles: userRoles } = useContext(UserContext);
  const isApprovalAdmin = useIsApprovalAdmin(userRoles);
  const intl = useIntl();

  const onKebabToggle = isOpen => {
    setIsKebabOpen(isOpen);
  };

  const onKebabSelect = () => {
    setIsKebabOpen(isKebabOpen => !isKebabOpen);
  };

  const checkCapability = (item, capability) => {
    if (isApprovalAdmin) {
      return true;
    }

    return item.metadata && item.metadata.user_capabilities && item.metadata.user_capabilities[capability];
  };

  const renderActionList = (request) => <ActionTranscript actionList={ request.actions }/>;

  return (
    <DataListItem key={ `request-${item.id}` }
      aria-labelledby={ `check-request-${item.id}` }
      isExpanded={ isExpanded }>
      <DataListItemRow>
        <DataListToggle
          onClick={ () => toggleExpand(`request-${item.id}`) }
          isExpanded={ isExpanded }
          id={ `request-${item.id}` }
          aria-labelledby={ `request-${item.id} request-${item.id}` }
          aria-label={ intl.formatMessage(requestsMessages.toogleDetailsFor) }
        />
        <DataListItemCells
          dataListCells={ [
            <DataListCell key={ item.id }>
              <span id={ `${item.id}-name` }>{ item.group_name ? item.group_name : item.name }</span>
            </DataListCell>,
            <DataListCell key={ `${item.id}-state` }>
              <span style={ { textTransform: 'capitalize' } } id={ `${item.id}-state` }>
                { intl.formatMessage(requestsMessages[item.state] || untranslatedMessage(item.state)) }
              </span>
            </DataListCell>,
            <DataListCell key={ `${item.id}-action` }>
              <RequestActions
                approveLink={ indexpath.approve }
                denyLink={ indexpath.deny }
                commentLink={ indexpath.addComment }
                request={ item }
                canApproveDeny={ checkCapability(item, 'approve') }
                canComment={ checkCapability(item, 'memo') }
              />
            </DataListCell>
          ] }/>
      </DataListItemRow>
      <DataListContent aria-label={ intl.formatMessage(requestsMessages.requestContentDetails) }
        isHidden={ !isExpanded }>
        <Stack hasGutter>
          <StackItem>
            <TextContent component={ TextVariants.h6 }>
              { renderActionList(item) }
            </TextContent>
          </StackItem>
        </Stack>
      </DataListContent>
    </DataListItem>
  );
};

Request.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    state: PropTypes.string,
    group_name: PropTypes.string.isRequired,
    requestActions: PropTypes.shape({
      data: PropTypes.array
    }),
    metadata: PropTypes.shape({
      user_capabilities: PropTypes.object
    })
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  toggleExpand: PropTypes.func.isRequired,
  indexpath: PropTypes.object
};

Request.defaultProps = {
  indexpath: routes.request
};
