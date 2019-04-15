import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Stack,
  StackItem,
  DataListItem,
  DataListCell,
  DataListCheck,
  DataListToggle,
  DataListContent,
  DropdownItem,
  Dropdown,
  DropdownPosition,
  KebabToggle,
  Title,
  TextVariants,
  TextContent } from '@patternfly/react-core';

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
        toggle={ <KebabToggle onToggle={ this.onKebabToggle }/> }
        isOpen = { this.state.isKebabOpen }
        dropdownItems={ [
          <DropdownItem aria-label="Edit Request" key="edit-request">
            <Link to={ `/requests/edit/${request.id}` }>
              Edit
            </Link>
          </DropdownItem>,
          <DropdownItem component="link" aria-label="Remove Request" key="remove-request">
            <Link to={ `/requests/remove/${request.id}` }>
              Delete
            </Link>
          </DropdownItem>
        ] }
        isPlain
      />
    );
  };

  fetchRequestDetails = (request) => {
    return `Details for ${request.name}`;
  };

  render() {
    let { item } = this.props;

    return (
      <DataListItem key={ `request-${item.id}` }
        aria-labelledby={ `check-request-${item.id}` }
        isExpanded={ this.props.isExpanded(`request-${item.id}`) }>
        <DataListToggle
          onClick={ () => this.props.toggleExpand(`request-${item.id}`) }
          isExpanded={ this.props.isExpanded(`request-${item.id}`) }
          id={ `request-${item.id}` }
          aria-labelledby={ `request-${item.id} request-${item.id}` }
          aria-label="Toggle details for"
        />
        <DataListCheck aria-labelledby={ `check-request-${item.id}` } name={ `check-request-${item.id}` }/>
        <DataListCell>
          <StackItem>
            <span id={ item.id }>{ `${item.name}` } </span>
          </StackItem>
          <StackItem>
            <span id={ item.description }>{ `${item.description}` } </span>
          </StackItem>
        </DataListCell>
        <DataListCell>
          { this.fetchRequestDetails(item) }
        </DataListCell>
        <DataListContent aria-label="Request Content Details"
          isHidden={ !this.props.isExpanded(`request-${item.id}`) }>
          <Stack gutter="md">
            <StackItem>
              <Title size="md">Details</Title>
            </StackItem>
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
  isLoading: propTypes.bool,
  item: propTypes.object,
  isExpanded: propTypes.func.isRequired,
  toggleExpand: propTypes.func.isRequired,
  noItems: propTypes.string
};

export default Request;
