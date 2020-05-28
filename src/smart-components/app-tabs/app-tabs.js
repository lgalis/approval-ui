import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useHistory } from 'react-router-dom';
import { Tabs, Tab } from '@patternfly/react-core';
import UserContext from '../../user-context';
import { isApprovalApprover } from '../../helpers/shared/helpers';

export const approvalTabItems = [{ eventKey: 0, title: 'Request queue', name: '/requests' },
  { eventKey: 1, title: 'All requests', name: '/allrequests' },
  { eventKey: 2, title: 'Approval processes', name: '/workflows' }];

export const adminTabItems = [{ eventKey: 0, title: 'All requests', name: '/allrequests' },
  { eventKey: 1, title: 'Approval processes', name: '/workflows' }];

export const AppTabs = () => {
  const history = useHistory();
  const { pathname, search } = useLocation();
  const { userRoles: userRoles } = useContext(UserContext);
  const tabItems = isApprovalApprover(userRoles) ? approvalTabItems : adminTabItems;

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
  tabItems: PropTypes.array
};
