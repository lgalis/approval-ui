import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';

const ApprovalBreadcrumbs = ({ breadcrumbs }) => breadcrumbs
  ? (
    <Breadcrumb>
      { Object.values(breadcrumbs).map(item => (
        <BreadcrumbItem key={ item.title } isActive={ item.isActive }>
          { (item.to && <NavLink exact to={ item.to }>{ item.title }</NavLink>) || item.title }
        </BreadcrumbItem>
      )) }
    </Breadcrumb>
  ) : null;

ApprovalBreadcrumbs.propTypes = {
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
    to: PropTypes.string
  }))
};

export default ApprovalBreadcrumbs;
