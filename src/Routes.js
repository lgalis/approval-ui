import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { lazy, Suspense } from 'react';
import { RequestLoader } from './presentational-components/shared/loader-placeholders';

/**
 * Aysnc imports of components
 *
 * https://webpack.js.org/guides/code-splitting/
 * https://reactjs.org/docs/code-splitting.html
 *
 * pros:
 *      1) code splitting
 *      2) can be used in server-side rendering
 * cons:
 *      1) naming chunk names adds unnecessary docs to code,
 *         see the difference with DashboardMap and InventoryDeployments.
 *
 */
const Requests = lazy(() => import('./smart-components/request/requests'));
const Workflows = lazy(() => import('./smart-components/workflow/workflows'));

const paths = {
  approval: '/',
  requests: '/requests',
  workflows: '/workflows'
};

const InsightsRoute = ({ rootClass, ...rest }) => {
  const root = document.getElementById('root');
  root.removeAttribute('class');
  root.classList.add(`page__${rootClass}`, 'pf-l-page__main', 'pf-c-page__main');
  root.setAttribute('role', 'main');
  return (<Route { ...rest } />);
};

InsightsRoute.propTypes = {
  rootClass: PropTypes.string
};

/**
 * the Switch component changes routes depending on the path.
 *
 * Route properties:
 *      exact - path must match exactly,
 *      path - https://prod.foo.redhat.com:1337/insights/advisor/rules
 *      component - component to be rendered when a route has been chosen.
 */
export const Routes = () => (
  <Suspense fallback={ <RequestLoader /> }>
    <Switch>
      <InsightsRoute path={ paths.requests } component={ Requests } rootClass="requests"/>
      <InsightsRoute path={ paths.workflows } component={ Workflows } rootClass="workflows" />
      { /* Finally, catch all unmatched routes */ }
      <Route render={ () => <Redirect to={ paths.requests } /> } />
    </Switch>
  </Suspense>
);
