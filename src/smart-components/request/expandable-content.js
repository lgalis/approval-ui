import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TextContent, Text, TextVariants, Level, LevelItem, Button, Bullseye } from '@patternfly/react-core';
import { isRequestStateActive } from '../../helpers/shared/helpers';
import { fetchRequestContent } from '../../helpers/request/request-helper';
import { Spinner } from '@redhat-cloud-services/frontend-components';

export const ExpandedItem = ({ title = '', detail = '' }) => (
  <TextContent>
    <Text className="data-table-detail heading" component={ TextVariants.small }>{ title }</Text>
    <Text className="data-table-detail content" component={ TextVariants.h5 }>{ detail }</Text>
  </TextContent>
);

ExpandedItem.propTypes = {
  title: PropTypes.node,
  detail: PropTypes.node
};

const ExpandableContent = ({ id, number_of_children, state, reason }) => {
  const requestActive = isRequestStateActive(state) && number_of_children === 0;
  const [ requestContent, setRequestContent ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ fetchStarted, setIsFetching ] = useState(false);

  const expandedRequests = useSelector(({ requestReducer: { expandedRequests }}) => expandedRequests);

  useEffect(() => {
    if (!fetchStarted && isLoading && expandedRequests.includes(id)) {
      setIsFetching(true);
      fetchRequestContent(id).then((data) => { setRequestContent(data); setIsLoading(false); }).catch(() => setIsLoading(false));
    }
  }, [ expandedRequests ]);

  if (isLoading) {
    return (<Bullseye>
      <Spinner/>
    </Bullseye>);
  }

  return (
    <Fragment>
      <Level>
        <LevelItem>
          <ExpandedItem title="Product" detail={ requestContent ? requestContent.product : 'Unknown' } />
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
          <ExpandedItem title="Portfolio" detail={ requestContent ? requestContent.portfolio : 'Unknown' }/>
          <ExpandedItem title="Platform" detail={ requestContent ? requestContent.platform : 'Unknown' }/>
          <ExpandedItem title="Reason" detail={ reason ? reason : '' }/>
        </LevelItem>
      </Level>
    </Fragment>
  );
};

ExpandableContent.propTypes = {
  id: PropTypes.string,
  content: PropTypes.object,
  number_of_children: PropTypes.number,
  uname: PropTypes.string,
  state: PropTypes.string,
  reason: PropTypes.string
};

export default ExpandableContent;
