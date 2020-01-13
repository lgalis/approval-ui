import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Button,
  Level,
  LevelItem,
  Toolbar,
  ToolbarItem,
  ToolbarGroup
} from '@patternfly/react-core';

import FilterToolbarItem from '../presentational-components/shared/filter-toolbar-item';
import TopToolbar, {
  TopToolbarTitle
} from '../presentational-components/shared/top-toolbar';
import AppTabs from '../smart-components/app-tabs/app-tabs';

const ToolbarButton = ({ title, ...props }) => (
  <Button { ...props }>{ title }</Button>
);

ToolbarButton.propTypes = {
  title: PropTypes.string.isRequired
};

const AppToolbar = ({ ...props }) => (
  <Toolbar className="pf-u-pr-lg toolbar" { ...props } />
);

const toolbarMapper = {
  TopToolbar,
  TopToolbarTitle,
  Toolbar: AppToolbar,
  ToolbarGroup,
  ToolbarItem,
  FilterToolbarItem,
  Link,
  Level,
  LevelItem,
  Button: ToolbarButton,
  AppTabs
};

export const toolbarComponentTypes = {
  TOP_TOOLBAR: 'TopToolbar',
  TOP_TOOLBAR_TITLE: 'TopToolbarTitle',
  TOOLBAR: 'Toolbar',
  TOOLBAR_ITEM: 'ToolbarItem',
  TOOLBAR_GROUP: 'ToolbarGroup',
  FILTER_TOOLBAR_ITEM: 'FilterToolbarItem',
  LINK: 'Link',
  BUTTON: 'Button',
  LEVEL: 'Level',
  LEVEL_ITEM: 'LevelItem',
  TABS: 'AppTabs'
};

export default toolbarMapper;
