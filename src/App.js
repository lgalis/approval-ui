import React, { useState, useEffect, Suspense } from 'react';
import { Main } from '@redhat-cloud-services/frontend-components/components/cjs/Main';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/dist/cjs/NotificationPortal';
import { Routes } from './Routes';
import { AppPlaceholder } from './presentational-components/shared/loader-placeholders';
import { defaultSettings } from './helpers/shared/pagination';
import 'whatwg-fetch';
// react-int eng locale data
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';

import '@redhat-cloud-services/frontend-components-notifications/index.css';
import '@redhat-cloud-services/frontend-components/components/index.css';
import { getRbacRoleApi } from './helpers/shared/user-login';
import UserContext from './user-context';
import { approvalRoles } from './helpers/shared/helpers';

import './App.scss';

const pathName = window.location.pathname.split('/');

pathName.shift();

let release = '/';

if (pathName[0] === 'beta') {
  release = `/${pathName.shift()}/`;
}

const App = () => {
  const [ auth, setAuth ] = useState(false);
  const [ userRoles, setUserRoles ] = useState({});

  useEffect(() => {
    insights.chrome.init();
    Promise.all([
      insights.chrome.auth
      .getUser()
      .then(() =>
        getRbacRoleApi()
        .listRoles(defaultSettings.limit, 0, 'Approval ', 'principal')
        .then((result) => setUserRoles(approvalRoles(result?.data)))
      )
    ]).then(() => setAuth(true));

    insights.chrome.identifyApp('approval');
  }, []);

  if (!auth) {
    return <AppPlaceholder />;
  }

  return (
    <BrowserRouter basename={ `${release}${pathName[0]}/${pathName[1]}/${pathName[2]}` }>
      <Suspense fallback={ <AppPlaceholder /> }>
        <IntlProvider locale="en">
          <UserContext.Provider value={ { userRoles } }>
            <React.Fragment>
              <NotificationsPortal />
              <Main className="pf-u-p-0 pf-u-ml-0">
                <Routes/>
              </Main>
            </React.Fragment>
          </UserContext.Provider>
        </IntlProvider>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
