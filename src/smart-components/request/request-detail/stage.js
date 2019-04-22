import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

class Stage extends Component {
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

  buildStageActionKebab = (stage) => {
    return (
      <Dropdown
        position={ DropdownPosition.right }
        onSelect={ this.onKebabSelect }
        toggle={ <KebabToggle onToggle={ this.onKebabToggle }/> }
        isOpen = { this.state.isKebabOpen }
        dropdownItems={ [
          <DropdownItem aria-label="Edit Stage" key="edit-stage">
            <Link to={ `/stages/comment/${stage.id}` }>
                  Comment
            </Link>
          </DropdownItem>
        ] }
        isPlain
      />
    );
  };

  fetchStageDetails = (stage) => {
    return `Details for ${stage.name}`;
  };

  render() {
    let { item } = this.props;

    return (
      <DataListItem key={ `stage-${item.id}` }
        aria-labelledby={ `check-stage-${item.id}` }
        isExpanded={ this.props.isExpanded(`stage-${item.id}`) }>
        <DataListToggle
          onClick={ () => this.props.toggleExpand(`stage-${item.id}`) }
          isExpanded={ this.props.isExpanded(`stage-${item.id}`) }
          id={ `stage-${item.id}` }
          aria-labelledby={ `stage-${item.id} stage-${item.id}` }
          aria-label="Toggle details for"
        />
        <DataListCheck aria-labelledby={ `check-stage-${item.id}` } name={ `check-stage-${item.id}` }/>
        <DataListCell>
          <StackItem>
            <span id={ item.id }>{ `${item.name}` } </span>
          </StackItem>
          <StackItem>
            <span id={ item.description }>{ `${item.description}` } </span>
          </StackItem>
        </DataListCell>
        <DataListCell>
          { this.fetchStageDetails(item) }
        </DataListCell>
        <DataListContent aria-label="Stage Content Details"
          isHidden={ !this.props.isExpanded(`stage-${item.id}`) }>
          <Stack gutter="md">
            <StackItem>
              <Title size="md">Details</Title>
            </StackItem>
            <StackItem>
              <TextContent component={ TextVariants.h6 }>
                { this.fetchStageDetails(item) }
              </TextContent>
            </StackItem>
          </Stack>
        </DataListContent>
      </DataListItem>
    );
  };
}

Stage.propTypes = {
  isLoading: PropTypes.bool,
  item: PropTypes.object,
  isExpanded: PropTypes.func.isRequired,
  toggleExpand: PropTypes.func.isRequired,
  noItems: PropTypes.string
};

export default Stage;
