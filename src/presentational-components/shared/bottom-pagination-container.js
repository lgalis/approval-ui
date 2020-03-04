import React from 'react';
import PropTypes from 'prop-types';

const BottomPaginationContainer = ({ children }) => (
  <div className="pf-u-p-lg pf-u-pt-md pf-u-pb-md global-primary-background pf-u-mt-auto">
    { children }
  </div>
);

BottomPaginationContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
};

export default BottomPaginationContainer;
