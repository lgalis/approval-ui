import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { TextContent, Text, TextVariants, Level, LevelItem, Button } from '@patternfly/react-core';
import { isRequestStateActive } from '../../helpers/shared/helpers';
import { fetchRequestContent } from '../../helpers/request/request-helper';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';

const ExpandedItem = (data) => {
  return (
    <TextContent>
      <Text className="data-table-detail heading" component={ TextVariants.small }>{ data ? data.title : '' }</Text>
      { data.isLoading ? <div>
        <Skeleton size={ SkeletonSize.sm } />
      </div> : <Text className="data-table-detail content"
        component={ TextVariants.h5 }>{ data ? data.detail : '' }</Text> }
    </TextContent>
  );
};

const ExpandableContent = ({ id, number_of_children, state, reason }) => {
  const requestActive = isRequestStateActive(state) && !number_of_children;
  const [ requestContent, setRequestContent ] = useState([]);
  const [ isLoading, setIsLoading ] = useState();

  useEffect(() => {
    fetchRequestContent(id).then((data) => { setRequestContent(data); setIsLoading(false); }).catch(() => setIsLoading(false));
  }, [ id ]);

  return (
    <Fragment>
      <Level>
        <LevelItem>
          <TextContent>
            <Text className="data-table-detail heading" component={ TextVariants.small }>Product</Text>
            { isLoading ? <div>
              <Skeleton size={ SkeletonSize.sm } />
            </div> :
              <Text className="data-table-detail content"
                component={ TextVariants.h5 }>{ requestContent ? requestContent.product : 'Unknown' }
              </Text> }
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
          <ExpandedItem title="Portfolio" isLoading={ isLoading } detail={ requestContent ? requestContent.portfolio : 'Unknown' }/>
          <ExpandedItem title="Platform" isLoading={ isLoading }  detail={ requestContent ? requestContent.platform : 'Unknown' }/>
          <ExpandedItem title="Reason" isLoading={ isLoading }  detail={ reason ? reason : '' }/>
        </LevelItem>

      </Level>
    </Fragment>
  );
};

ExpandableContent.propTypes = {
  id: PropTypes.string,
  content: PropTypes.object,
  number_of_children: PropTypes.string,
  uname: PropTypes.string,
  state: PropTypes.string,
  reason: PropTypes.string
};
export default ExpandableContent;

