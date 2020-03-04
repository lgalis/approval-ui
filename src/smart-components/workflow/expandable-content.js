import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';
import { useSelector } from 'react-redux';
import { fetchGroupName } from '../../helpers/group/group-helper';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/components/Skeleton';

const ExpandableContent = ({ description, groupRefs, id }) => {
  const [ groupNames, setGroupNames ] = useState([]);
  const [ isLoaded, setIsLoaded ] = useState();
  const [ fetching, setFetching ] = useState();

  const expandedWorkflows = useSelector(({ workflowReducer: { expandedWorkflows }}) => expandedWorkflows);

  const fetchGroupNames = () => Promise.all(groupRefs.map((ref) => fetchGroupName(ref)));

  useEffect(() => {
    if (!isLoaded && expandedWorkflows.includes(id) && !fetching) {
      setFetching(true);
      fetchGroupNames(groupRefs).then((data) => { setGroupNames(data); setIsLoaded(true); }).catch(() => setIsLoaded(true));
    }
  }, [ expandedWorkflows ]);

  return (
    <Fragment>
      <TextContent>
        <Text className="data-table-detail heading" component={ TextVariants.small }>Description</Text>
        <Text className="data-table-detail content" component={ TextVariants.h5 }>{ description }</Text>
      </TextContent>
      <TextContent>
        <Fragment>
          <Text className="data-table-detail heading" component={ TextVariants.small }>Groups</Text>
          { isLoaded ?
            <Text className="data-table-detail content"
              component={ TextVariants.h5 }>
              { groupNames.join(',') }
            </Text> :
            <div>
              <Skeleton size={ SkeletonSize.sm } />
            </div> }
        </Fragment>
      </TextContent>
    </Fragment>
  );
};

ExpandableContent.propTypes = {
  description: PropTypes.string,
  groupRefs: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired
};

export default ExpandableContent;
