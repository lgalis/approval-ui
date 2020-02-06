import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isRequestStateActive } from '../../../helpers/shared/helpers';
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

class Request extends Component {
  state = {
    isKebabOpen: false
  };

  onKebabToggle = isOpen => {
    this.setState({
      isKebabOpen: isOpen
    });
  };

  onKebabSelect = () => {
    this.setState({ isKebabOpen: !this.state.isKebabOpen });
  };

  buildRequestActionKebab = (request) => {
    return (
      <Dropdown
        position={ DropdownPosition.right }
        onSelect={ this.onKebabSelect }
        toggle={ <KebabToggle id={ `request-request-dropdown-${request.id}` } onToggle={ this.onKebabToggle }/> }
        isOpen={ this.state.isKebabOpen }
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

  fetchRequestDetails = (request) => {
    return <ActionTranscript actionList={ request.actions }/>;
  };

  render() {
    const { item, isExpanded } = this.props;
    const requestActive = isRequestStateActive(item.state);
    return (
      <DataListItem key={ `request-${item.id}` }
        aria-labelledby={ `check-request-${item.id}` }
        isExpanded={ isExpanded }>
        <DataListItemRow>
          <DataListToggle
            onClick={ () => this.props.toggleExpand(`request-${item.id}`) }
            isExpanded={ isExpanded }
            id={ `request-${item.id}` }
            aria-labelledby={ `request-${item.id} request-${item.id}` }
            aria-label="Toggle details for"
          />
          <DataListItemCells
            dataListCells={ [
              <DataListCell key={ item.id }>
                <span id={ `${item.id}-name` }>{ `${this.props.idx + 1}. ${item.parent_id ? item.group_name : item.name}` } </span>
              </DataListCell>,
              <DataListCell key={ `${item.id}-state` }>
                <span style={ { textTransform: 'capitalize' } } id={ `${item.id}-state` }>{ `${item.state}` } </span>
              </DataListCell>,
              <DataListCell key={ `${item.id}-action` }>
                <Level>
                  <LevelItem>
                    { (requestActive) &&
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
                { requestActive && this.buildRequestActionKebab(item) }
              </DataListCell>
            ] }/>
        </DataListItemRow>
        <DataListContent aria-label="Request Content Details"
          isHidden={ !isExpanded }>
          <Stack gutter="md">
            <StackItem>
              <TextContent component={ TextVariants.h6 }>
                { this.fetchRequestDetails(item) }
              </TextContent>
            </StackItem>
          </Stack>
        </DataListContent>

      </DataListItem>
    );
  };
}

Request.propTypes = {
  isLoading: PropTypes.bool,
  item: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    state: PropTypes.string,
    parent_id: PropTypes.string,
    group_name: PropTypes.string,
    requestActions: PropTypes.shape({
      data: PropTypes.array
    })
  }).isRequired,
  idx: PropTypes.number,
  isExpanded: PropTypes.bool.isRequired,
  toggleExpand: PropTypes.func.isRequired,
  noItems: PropTypes.string
};

export default Request;
