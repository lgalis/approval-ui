import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
  Stack,
  StackItem,
  Button,
  DataListItem,
  DataListCell,
  DataListToggle,
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
            <Link to={ `/requests/comment/${stage.requestId}` }>
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
        <DataListCell>
          <span id={ item.id }>{ `${item.name}` } </span>
        </DataListCell>
        <DataListCell>
          <span style={ { textTransform: 'capitalize' } } id={ `${item.id}-state` }>{ `${item.state}` } </span>
        </DataListCell>
        <DataListCell>
          <Level>
            <LevelItem>
              <Link to={ `/requests/detail/${item.request_id}/approve` }>
                <Button variant="link" aria-label="Approve Request">
                  Approve
                </Button>
              </Link>
              <Link to={ `/requests/detail/${item.request_id}/deny` }>
                <Button variant="link" className="destructive-color" aria-label="Deny Request">
                  Deny
                </Button>
              </Link>
            </LevelItem>
          </Level>
        </DataListCell>
        <DataListCell>
          <span> </span>
        </DataListCell>
        <DataListContent aria-label="Stage Content Details"
          isHidden={ !this.props.isExpanded(`stage-${item.id}`) }>
          <Stack gutter="md">
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
