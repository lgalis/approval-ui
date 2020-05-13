import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, useHistory } from 'react-router-dom';
import { Tabs, Tab } from '@patternfly/react-core';

const approvalTabItems = [{ eventKey: 0, title: 'Request queue', name: 'requests/queue' },
  { eventKey: 1, title: 'All requests', name: '/requests/all' },
  { eventKey: 2, title: 'Approval processes', name: '/workflows' }];

export const AppTabs = ({ tabItems = approvalTabItems }) => {
  const history = useHistory();
  const { pathname, search } = useLocation();
  const activeTab = tabItems.find(({ name }) => pathname.includes(name));
  const handleTabClick = (_event, tabIndex) =>
    history.push({ pathname: tabItems[tabIndex].name, search });

  return (
    <Tabs className="pf-u-mt-sm" activeKey={ activeTab ? activeTab.eventKey : 0 } onSelect={ handleTabClick }>
      { tabItems.map((item) => <Tab title={ item.title } key={ item.eventKey } eventKey={ item.eventKey } name={ item.name }/>) }
    </Tabs>
  );
};

AppTabs.propTypes = {
  tabItems: PropTypes.array.isRequired
};
