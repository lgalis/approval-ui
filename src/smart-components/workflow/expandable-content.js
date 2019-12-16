import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';
import { fetchGroupName } from '../../helpers/group/group-helper';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';

const ExpandableContent = ({ description, groupRefs }) => {
  const [ groupNames, setGroupNames ] = useState([]);
  const [ isLoaded, setIsLoaded ] = useState();

  const fetchGroupNames = async() => {
    const names = [];
    await Promise.all(groupRefs.map(async (ref) => {
      names.push(await fetchGroupName(ref));
    }));
    return names;
  };

  useEffect(() => {
    fetchGroupNames(groupRefs).then((data) => { setGroupNames(data); setIsLoaded(true); }).catch(() => setIsLoaded(true));
  }, []);

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
  );};

ExpandableContent.defaultProps = {
  groupNames: [],
  iFetching: false
};

ExpandableContent.propTypes = {
  description: PropTypes.string,
  groupRefs: PropTypes.array.isRequired,
  groupNames: PropTypes.array,
  isLoaded: PropTypes.bool
};

export default ExpandableContent;

