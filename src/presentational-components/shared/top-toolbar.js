import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Level, LevelItem, Text, TextContent, TextVariants  } from '@patternfly/react-core';
import { ToolbarTitlePlaceholder } from './loader-placeholders';
import ApprovalBreadcrumbs from './breadcrubms';
import './top-toolbar.scss';

const TopToolbar = ({ children }) => (
  <div>
    <Level className="pf-u-mb-md">
      <ApprovalBreadcrumbs />
    </Level>
    { children }
  </div>
);

TopToolbar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  paddingBottom: PropTypes.bool
};

TopToolbar.defaultProps = {
  paddingBottom: true
};

export default TopToolbar;

export const TopToolbarTitle = ({ title, children }) => (
  <Fragment>
    <Level className="pf-u-mb-xl">
      <LevelItem>
        <TextContent className="top-toolbar-title">
          { <Text component={ TextVariants.h2 }>{ title || <ToolbarTitlePlaceholder /> }</Text> }
        </TextContent>
      </LevelItem>
      { children }
    </Level>
  </Fragment>
);

TopToolbarTitle.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
};
