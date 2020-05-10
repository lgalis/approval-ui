import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isApprovalAdmin, isRequestStateActive } from '../../../helpers/shared/helpers';
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

export const Request = ({ item, isExpanded, toggleExpand }) => {
  const [ isKebabOpen, setIsKebabOpen ] = useState(false);
  const { roles: userRoles } = useContext(UserContext);

  const onKebabToggle = isOpen => {
    setIsKebabOpen(isOpen);
  };

  const onKebabSelect = () => {
    setIsKebabOpen(!isKebabOpen);
  };

  const checkCapability = (item, capability) => {
    if (isApprovalAdmin(userRoles)) {
      return true;
    }

    //console.log('DEBUG- item.metadata.user_capabilities, value for cap',
    // item.metadata.user_capabilities, capability, item.metadata.user_capabilities[capability] )
    return item.metadata && item.metadata.user_capabilities && item.metadata.user_capabilities[capability];
  };

  const buildRequestActionKebab = (request) => {
    console.log('Debug1 - request', request);
    return (
      <Dropdown
        position={ DropdownPosition.right }
        onSelect={ onKebabSelect }
        toggle={ <KebabToggle id={ `request-request-dropdown-${request.id}` } onToggle={ onKebabToggle }/> }
        isOpen={ isKebabOpen }
        dropdownItems={ [
          <DropdownItem aria-label="Add Comment" key={ `add_comment_${request.id}` }>
            <Link
              id={ `request-${request.id}-request-comment` }
              to={ `/requests/detail/${request.id}/add_comment` }
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

  const fetchRequestDetails = (request) => {
    console.log('Debug - detail for request: ', request);
    return <ActionTranscript actionList={ request.actions }/>;
  };

  const renderRequest = () => {
    console.log('Debug - renderRequest: item, isExpanded, toggleExpand - ', item, isExpanded, toggleExpand);
    const requestActive = isRequestStateActive(item.state);
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
                    { (requestActive && checkCapability(item, 'approve')) &&
                    <div>
                      <Link id={ `approve-${item.id}` } to={ `/requests/detail/${item.id}/approve` }>
                        <Button variant="link" aria-label="Approve Request">
                          Approve
                        </Button>
                      </Link>
                      <Link id={ `deny-${item.id}` } to={ `/requests/detail/${item.id}/deny` }>
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
                { requestActive && checkCapability(item, 'memo') && buildRequestActionKebab(item) }
              </DataListCell>
            ] }/>
        </DataListItemRow>
        <DataListContent aria-label="Request Content Details"
          isHidden={ !isExpanded }>
          <Stack gutter="md">
            <StackItem>
              <TextContent component={ TextVariants.h6 }>
                { fetchRequestDetails(item) }
              </TextContent>
            </StackItem>
          </Stack>
        </DataListContent>

      </DataListItem>
    );
  };

  return renderRequest();
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
    })
  }).isRequired,
  idx: PropTypes.number,
  isExpanded: PropTypes.bool.isRequired,
  toggleExpand: PropTypes.func.isRequired,
  noItems: PropTypes.string
};
