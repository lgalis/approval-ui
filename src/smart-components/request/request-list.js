import React, { Component } from 'react';
import propTypes from 'prop-types';
import { PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { DataList } from '@patternfly/react-core';
import Request from './request';

class RequestList extends Component {

  state= {
    expanded: []
  };

  toggleExpand = id => {
    const expanded = this.state.expanded;
    const index = expanded.indexOf(id);
    const newExpanded =
        index >= 0 ? [ ...expanded.slice(0, index), ...expanded.slice(index + 1, expanded.length) ] : [ ...expanded, id ];
    this.setState(() => ({ expanded: newExpanded }));
  };

  isExpanded = key => this.state.expanded.includes(key);

  render() {
    if (this.props.isLoading || this.props.items.length === 0) {
      return (
        <PageHeader>
          <PageHeaderTitle title={ this.props.noItems }/>
        </PageHeader>
      );
    }

    return (
      <React.Fragment>
        { (this.props.items && this.props.items.length > 0) && (
          <DataList aria-label="Expandable data list">
            { this.props.items.map((item) => {
              return (
                <Request key= { item.id } item={ item } isExpanded={ this.isExpanded } toggleExpand={ this.toggleExpand }/>);
            })
            }
          </DataList>)
        }
      </React.Fragment>
    );
  };
}

RequestList.propTypes = {
  isLoading: propTypes.bool,
  items: propTypes.array,
  noItems: propTypes.string
};

export default RequestList;
