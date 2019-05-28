import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';

const SummaryContent = (values) => {
  const { name, description, wfGroups } = values.values;

  return (
    <Fragment>
      <TextContent>
        <Text className="data-table-detail heading" component={ TextVariants.h5 }>Please review the workflow
          details</Text>
      </TextContent>
      <TextContent>
        <Text className="data-table-detail heading" component={ TextVariants.h5 }>Name</Text>
        <Text className="data-table-detail content" component={ TextVariants.p }>{ name }</Text>
      </TextContent>
      <TextContent>
        <Text className="data-table-detail heading" component={ TextVariants.h5 }>Description</Text>
        <Text className="data-table-detail content" component={ TextVariants.p }>{ description }</Text>
      </TextContent>
      <TextContent>
        <Text className="data-table-detail heading" component={ TextVariants.h5 }>Approval Stages</Text>
        { wfGroups.map((stage, idx)  =>
          <Text key={ stage.value }
            className="data-table-detail content"
            component={ TextVariants.p }>
            { `Stage ${idx + 1} : ${values.groupOptions.find(group => group.value === wfGroups[idx].stage).label}` }
          </Text>) }
      </TextContent>
    </Fragment>
  );
};

SummaryContent.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  groups: PropTypes.array
};

export default SummaryContent;

