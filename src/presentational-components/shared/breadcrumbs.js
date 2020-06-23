import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';

const ApprovalBreadcrumbs = ({ breadcrumbs }) => breadcrumbs
  ? (
    <Breadcrumb>
      { breadcrumbs.map(({ to, id, title }, idx) => (
        <BreadcrumbItem key={ title } isActive={ idx === (breadcrumbs.length - 1) } id={ id }>
          { (to && <NavLink isActive={ () => false } exact to={ to }>{ title }</NavLink>) || title }
        </BreadcrumbItem>
      )) }
    </Breadcrumb>
  ) : null;

ApprovalBreadcrumbs.propTypes = {
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    to: PropTypes.string
  }))
};

export default ApprovalBreadcrumbs;
