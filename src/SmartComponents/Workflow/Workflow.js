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
        isOpen = { this.state.isKebabOpen }
        dropdownItems={ [
          <DropdownItem aria-label="Edit Workflow" key="edit-workflow">
            <Link to={ `/workflows/edit/${workflow.id}` }>
              Edit
            </Link>
          </DropdownItem>,
          <DropdownItem component="link" aria-label="Remove Workflow" key="remove-workflow">
            <Link to={ `/workflows/remove/${workflow.id}` }>
              Delete
            </Link>
          </DropdownItem>
        ] }
        isPlain
      />
    );
  };

  fetchDetailsForWorkflow = (workflow) => {
    return `Stages for ${workflow.name}`;
  };

  render() {
    let { item } = this.props;

    return (
      <DataListItem key={ `workflow-${item.id}` }
        aria-labelledby={ `check-workflow-${item.id}` }
        isExpanded={ this.props.isExpanded(`workflow-${item.id}`) }>
        <DataListToggle
          onClick={ () => this.props.toggleExpand(`workflow-${item.id}`) }
          isExpanded={ this.props.isExpanded(`workflow-${item.id}`) }
          id={ `workflow-${item.id}` }
          aria-labelledby={ `workflow-${item.id} workflow-${item.id}` }
          aria-label="Toggle details for"
        />
        <DataListCheck aria-labelledby={ `check-workflow-${item.id}` } name={ `check-workflow-${item.id}` }/>
        <DataListCell>
          <span id={ item.id }>{ item.name } </span>
        </DataListCell>
        <DataListCell>
          { item.description }
        </DataListCell>
        <DataListCell
          class="pf-c-data-list__action"
          aria-labelledby={ `workflow-${item.id} check-workflow-action${item.id}` }
          id={ `workflow-${item.id}` }
          aria-label="Actions">
          { this.buildWorkflowActionKebab(item) }
        </DataListCell>
        <DataListContent aria-label="Workflow Content Details"
          isHidden={ !this.props.isExpanded(`workflow-${item.id}`) }>
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
              <Title size="md">Stages</Title>
            </StackItem>
            <StackItem>
              <TextContent component={ TextVariants.h6 }>
                { this.fetchDetailsForWorkflow(item) }
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
