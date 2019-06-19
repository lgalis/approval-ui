import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { TextContent, Text, TextVariants, Level, LevelItem, Button } from '@patternfly/react-core';
import { isRequestStateActive } from '../../helpers/shared/helpers';

const expandedItem = (title, detail) => {
  return (<TextContent>
    <Text className="data-table-detail heading" component={ TextVariants.small }>{ title }</Text>
    <Text className="data-table-detail content"
      component={ TextVariants.h5 }>{ detail }</Text>
  </TextContent>);
};

const ExpandableContent = ({ id, content, state, reason }) => {
  const requestActive = isRequestStateActive(state);
  return (
    <Fragment>
      <Level>
        <LevelItem>
          <TextContent>
            <Text className="data-table-detail heading" component={ TextVariants.small }>Product</Text>
            <Text className="data-table-detail content"
              component={ TextVariants.h5 }>{ content ? content.product : 'Unknown' }</Text>
          </TextContent>
        </LevelItem>
        { requestActive && <LevelItem>
          <Link to={ `/requests/approve/${id}` }  className="pf-u-mr-md">
            <Button variant="primary" aria-label="Approve Request" isDisabled={ !requestActive }>
              Approve
            </Button>
          </Link>
          <Link to={ `/requests/deny/${id}` }>
            <Button variant="danger" aria-label="Deny Request">
              Deny
            </Button>
          </Link>
        </LevelItem>
        }</Level>
      <Level>
        <LevelItem>
          { expandedItem('Portfolio', content ? content.portfolio : 'Unknown') }e
          { expandedItem('Platform', content ? content.platform : 'Unknown') }
          { expandedItem('Reason', reason) }
        </LevelItem>

      </Level>
    </Fragment>
  );
};

ExpandableContent.propTypes = {
  id: PropTypes.string,
  content: PropTypes.obuidt,
  uname: PropTypes.string,
  state: PropTypes.string,
  reason: PropTypes.string
};
export default ExpandableContent;

