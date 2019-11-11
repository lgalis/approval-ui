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
        toggle={ <KebabToggle id={ `stage-request-dropdown-${stage.request_id}` } onToggle={ this.onKebabToggle }/> }
        isOpen={ this.state.isKebabOpen }
        dropdownItems={ [
          <DropdownItem aria-label="Add Comment" key={ `add_comment_${stage.id}` }>
            <Link
              id={ `stage-${stage.request_id}-request-comment` }
              to={ `/requests/detail/${stage.request_id}/add_comment` }
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

  fetchStageDetails = (stage) => {
    return <ActionTranscript actionList={ stage.stageActions.data }/>;
  };

  render() {
    const { item } = this.props;
    const requestActive = isRequestStateActive(item.state);
    return (
      <DataListItem key={ `stage-${item.id}` }
        aria-labelledby={ `check-stage-${item.id}` }
        isExpanded={ this.props.isExpanded(`stage-${item.id}`) }>
        <DataListItemRow>
          <DataListToggle
            onClick={ () => this.props.toggleExpand(`stage-${item.id}`) }
            isExpanded={ this.props.isExpanded(`stage-${item.id}`) }
            id={ `stage-${item.id}` }
            aria-labelledby={ `stage-${item.id} stage-${item.id}` }
            aria-label="Toggle details for"
          />
          <DataListItemCells
            dataListCells={ [
              <DataListCell key={ item.id }>
                <span id={ item.id }>{ `${this.props.idx + 1}. ${item.name}` } </span>
              </DataListCell>,
              <DataListCell key={ `${item.id}-state` }>
                <span style={ { textTransform: 'capitalize' } } id={ `${item.id}-state` }>{ `${item.state}` } </span>
              </DataListCell>,
              <DataListCell key={ `${item.id}-action` }>
                <Level>
                  <LevelItem>
                    { (requestActive && this.props.isActive) &&
                    <div>
                      <Link id={ `approve-${item.request_id}` } to={ `/requests/detail/${item.request_id}/approve` }>
                        <Button variant="link" aria-label="Approve Request">
                          Approve
                        </Button>
                      </Link>
                      <Link id={ `deny-${item.request_id}` } to={ `/requests/detail/${item.request_id}/deny` }>
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
                { requestActive && this.props.isActive  && this.buildStageActionKebab(item) }
              </DataListCell>
            ] }/>
        </DataListItemRow>
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
  isActive: PropTypes.bool,
  item: PropTypes.shape({
    state: PropTypes.string,
    request_id: PropTypes.string,
    stageActions: PropTypes.shape({
      data: PropTypes.array
    })
  }).isRequired,
  idx: PropTypes.number,
  isExpanded: PropTypes.func.isRequired,
  toggleExpand: PropTypes.func.isRequired,
  noItems: PropTypes.string
};

export default Stage;
