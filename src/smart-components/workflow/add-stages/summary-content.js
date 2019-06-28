import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';

const SummaryContent = (formData, groupOptions) => {
  const { name, description, ...stages } =
      formData ? formData : { name: '', description: '' };

  return (
    <Fragment>
      <TextContent>
        <Text className="data-table-detail heading" component={ TextVariants.h5 }>
          Review and confirm your inputs. If there is anything incorrect, click Back and revise.</Text>
      </TextContent>
      <TextContent>
        <Text className="data-table-detail heading" component={ TextVariants.h5 }>Workflow name</Text>
        <Text className="data-table-detail content" component={ TextVariants.p }>{ name }</Text>
      </TextContent>
      <TextContent>
        <Text className="data-table-detail heading" component={ TextVariants.h5 }>Description</Text>
        <Text className="data-table-detail content" component={ TextVariants.p }>{ description }</Text>
      </TextContent>
      { stages && <TextContent>
        { Object.keys(stages).map(key => key.startsWith('stage') &&
            <Text key={ key }
              className="data-table-detail content"
              component={ TextVariants.p }>
              { `${key} : ${groupOptions.find(group => group.value === stages[key]).label}` }
            </Text>) }
      </TextContent> }
    </Fragment>
  );
};

SummaryContent.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  groups: PropTypes.array
};

export default SummaryContent;

