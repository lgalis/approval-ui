import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@patternfly/react-core';

const tabItems = [{ eventKey: 0, title: 'Requests', name: '/requests' }, { eventKey: 1, title: 'Workflows', name: '/workflows' }];

const AppTabs = ({ history: { push }, location: { pathname }}) => {
  const activeTab = tabItems.find(({ name }) => pathname.includes(name));
  const handleTabClick = (_event, tabIndex) => push(tabItems[tabIndex].name);

  return (
    <Tabs className="pf-u-mt-md" activeKey={ activeTab ? activeTab.eventKey : 0 } onSelect={ handleTabClick }>
      { tabItems.map((item) => <Tab title={ item.title } key={ item.eventKey } eventKey={ item.eventKey } name={ item.name }/>) }
    </Tabs>
  );
};

AppTabs.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  })
};

export default withRouter(AppTabs);
