import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {useIsApprovalAdmin, isRequestStateActive, useIsApprovalApprover} from '../../../helpers/shared/helpers';
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

export const Request = ({ item, isExpanded, toggleExpand }) => {
  const [ isKebabOpen, setIsKebabOpen ] = useState(false);
  const { userRoles: userRoles } = useContext(UserContext);
  const isApprovalAdmin = useIsApprovalAdmin(userRoles);

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

  const buildRequestActionKebab = (request) => {
    return (
      <Dropdown
        position={ DropdownPosition.right }
        onSelect={ onKebabSelect }
        toggle={ <KebabToggle id={ `request-request-dropdown-${request.id}` } onToggle={ onKebabToggle }/> }
        isOpen={ isKebabOpen }
        dropdownItems={ [
          <DropdownItem aria-label="Add Comment" key={ `add_comment_${request.id}` } component="button">
            <Link
              id={ `request-${request.id}-request-comment` }
              to={ {
                pathname: routes.request.addComment,
                search: `?request=${request.id}`
              } }
              className="pf-c-dropdown__menu-item"
            >
              Comment
            </Link>
          </DropdownItem>
        ] }
        isPlain
      />
    );
  };

  const renderActionList = (request) => {
    return <ActionTranscript actionList={ request.actions }/>;
  };

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
          aria-label="Toggle details for"
        />
        <DataListItemCells
          dataListCells={ [
            <DataListCell key={ item.id }>
              <span id={ `${item.id}-name` }>{ `${item.group_name ? item.group_name : item.name}` } </span>
            </DataListCell>,
            <DataListCell key={ `${item.id}-state` }>
              <span style={ { textTransform: 'capitalize' } } id={ `${item.id}-state` }>{ `${item.state}` } </span>
            </DataListCell>,
            <DataListCell key={ `${item.id}-action` }>
              <Level>
                <LevelItem>
                  { (isRequestStateActive(item.state) && checkCapability(item, 'approve')) &&
                    <div>
                      <Link id={ `approve-${item.id}` } to={ { pathname: routes.request.approve, search: `?request=${item.id}` } }>
                        <Button variant="link" aria-label="Approve Request">
                          Approve
                        </Button>
                      </Link>
                      <Link id={ `deny-${item.id}` } to={ { pathname: routes.request.deny, search: `?request=${item.id}` } }>
                        <Button variant="link" className="destructive-color" aria-label="Deny Request">
                          Deny
                        </Button>
                      </Link>
                    </div> }
                </LevelItem>
              </Level>
            </DataListCell>,
            <DataListCell
              key={ `request-${item.id}` }
              className="pf-c-data-list__action"
              aria-labelledby={ `request-${item.id} check-request-action${item.id}` }
              id={ `workflow-${item.id}` }
              aria-label="Actions">
              { isRequestStateActive(item.state) && checkCapability(item, 'memo') && buildRequestActionKebab(item) }
            </DataListCell>
          ] }/>
      </DataListItemRow>
      <DataListContent aria-label="Request Content Details"
        isHidden={ !isExpanded }>
        <Stack gutter="md">
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
  isLoading: PropTypes.bool,
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
  idx: PropTypes.number,
  isExpanded: PropTypes.bool.isRequired,
  toggleExpand: PropTypes.func.isRequired,
  noItems: PropTypes.string
};
