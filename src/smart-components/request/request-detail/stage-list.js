import React, { Component, Fragment } from 'react';
import propTypes from 'prop-types';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { DataList } from '@patternfly/react-core';
import Stage from './stage';
import { DataListLoader } from '../../../presentational-components/shared/loader-placeholders';

class StageList extends Component {
  state = {
    expanded: []
  };

  toggleExpand = id => this.setState(({ expanded }) => {
    const index = expanded.indexOf(id);
    const newExpanded =
      index >= 0 ? [ ...expanded.slice(0, index), ...expanded.slice(index + 1, expanded.length) ] : [ ...expanded, id ];
    return ({ expanded: newExpanded });
  });

  isExpanded = key => {
    return this.state.expanded.includes(key);
  };

  render() {
    return (
      <Fragment>
        <div>
          { this.props.isLoading && (
            <Fragment>
              <PageHeader>
                <PageHeaderTitle title={ this.props.noItems }/>
              </PageHeader>
              <DataListLoader/>
            </Fragment>
          ) }
        </div>
        { this.props.items.length > 0 && (
          <DataList aria-label="Expandable data list">
            { this.props.items.map((item, idx) => (
              <Stage
                key={ item.id }
                item={ item }
                idx={ idx }
                isActive={ idx + 1 === this.props.active_stage }
                isExpanded={ this.isExpanded(`stage-${item.id}`) }
                toggleExpand={ this.toggleExpand }
              />)) }
          </DataList>)
        }
      </Fragment>
    );
  };
}

StageList.propTypes = {
  isLoading: propTypes.bool,
  items: propTypes.array,
  noItems: propTypes.string,
  active_stage: propTypes.number
};

StageList.defaultProps = {
  items: []
};

export default StageList;

