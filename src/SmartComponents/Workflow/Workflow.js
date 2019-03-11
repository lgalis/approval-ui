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

class Workflow extends Component {
  state = {
    isKebabOpen: false
  };

  onKebabToggle = isOpen => {
    this.setState({
      isKebabOpen: isOpen
    });
  };

  onKebabSelect = (event) => {
    this.setState({ isKebabOpen: !this.state.isKebabOpen });
  };

  buildWorkflowActionKebab = (workflow) => {
    return (
      <Dropdown
        position={ DropdownPosition.right }
        onSelect={ this.onKebabSelect }
        toggle={ <KebabToggle onToggle={ this.onKebabToggle }/> }
        isOpen = { this.state.isKebabOpen}
        dropdownItems={ [
          <DropdownItem aria-label="Edit Workflow" key="edit-workflow">
            <Link to={ `/workflows/edit/${workflow.uuid}` }>
              Edit
            </Link>
          </DropdownItem>,
          <DropdownItem component="link" aria-label="Remove Workflow" key="remove-workflow">
            <Link to={ `/workflows/remove/${workflow.uuid}` }>
              Delete
            </Link>
          </DropdownItem>
        ] }
        isPlain
      />
    );
  };

  fetchRequestListForWorkflow = (workflow) => {
    if (!workflow.members) {
      return '';
    }
    return workflow.members.map(request => ` ${request.requestname}`).join(', ');
  };

  render() {
    let { item } = this.props;

    return (
      <DataListItem key={ `workflow-${item.uuid}` }
        aria-labelledby={ `check-workflow-${item.uuid}` }
        isExpanded={ this.props.isExpanded(`workflow-${item.uuid}`) }>
        <DataListToggle
          onClick={ () => this.props.toggleExpand(`workflow-${item.uuid}`) }
          isExpanded={ this.props.isExpanded(`workflow-${item.uuid}`) }
          id={ `workflow-${item.uuid}` }
          aria-labelledby={ `workflow-${item.uuid} workflow-${item.uuid}` }
          aria-label="Toggle details for"
        />
        <DataListCheck aria-labelledby={ `check-workflow-${item.uuid}` } name={ `check-workflow-${item.uuid}` }/>
        <DataListCell>
          <span id={ item.uuid }>{ item.name } </span>
        </DataListCell>
        <DataListCell>
          { this.fetchRequestListForWorkflow(item) }
        </DataListCell>
        <DataListCell
          class="pf-c-data-list__action"
          aria-labelledby={ `workflow-${item.uuid} check-workflow-action${item.uuid}` }
          id={ `workflow-${item.uuid}` }
          aria-label="Actions">
          { this.buildWorkflowActionKebab(item) }
        </DataListCell>
        <DataListContent aria-label="Workflow Content Details"
          isHidden={ !this.props.isExpanded(`workflow-${item.uuid}`) }>
          <Stack gutter="md">
            <StackItem>
              <Title size="md">Description</Title>
            </StackItem>
            <StackItem>
              <TextContent component={ TextVariants.h6 }>
                { item.description }
              </TextContent>
            </StackItem>
            <StackItem>
            </StackItem>
            <StackItem>
              <Title size="md">Members</Title>
            </StackItem>
            <StackItem>
              <TextContent component={ TextVariants.h6 }>
                { this.fetchRequestListForWorkflow(item) }
              </TextContent>
            </StackItem>
          </Stack>
        </DataListContent>
      </DataListItem>
    );
  };
}

Workflow.propTypes = {
  isLoading: propTypes.bool,
  item: propTypes.object,
  isExpanded: propTypes.func.isRequired,
  toggleExpand: propTypes.func.isRequired,
  noItems: propTypes.string
};

export default Workflow;
