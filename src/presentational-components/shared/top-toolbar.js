import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Text, TextContent, TextVariants  } from '@patternfly/react-core';
import { ToolbarTitlePlaceholder } from './loader-placeholders';
import ApprovalBreadcrumbs from './breadcrubms';

import './top-toolbar.scss';
const TopToolbar = ({ breadcrumbs = [], children }) => (
  <div>
    <ApprovalBreadcrumbs { ...breadcrumbs }/>
    { children }
  </div>
);

TopToolbar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  showTabs: PropTypes.boolean,
  breadcrumbs: PropTypes.array,
  paddingBottom: PropTypes.bool
};

TopToolbar.defaultProps = {
  paddingBottom: true
};

export default TopToolbar;

export const TopToolbarTitle = ({ title, children }) => (
  <Fragment>
    <TextContent className="top-toolbar-title">
      { <Text component={ TextVariants.h2 }>{ title || <ToolbarTitlePlaceholder /> }</Text> }
    </TextContent>
    { children }
  </Fragment>
);

TopToolbarTitle.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
};

