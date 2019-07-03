import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
  Title
} from '@patternfly/react-core';

import {  } from '@patternfly/react-core';

const SummaryContent = (formData) => {
  const { name, description, stages } =
      formData.values ? formData.values : { name: '', description: '', stages: []};

  return (
    <Fragment>
      <Stack gutter="md">
        <StackItem>
          <Title size="xl"> Review </Title>
        </StackItem>
        <StackItem>
          <Stack gutter="sm">
            <StackItem>
              <TextContent>
                <Text className="data-table-detail heading" component={ TextVariants.h5 }>
                Review and confirm your inputs. If there is anything incorrect, click Back and revise.</Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text className="data-table-detail heading" component={ TextVariants.h5 }>Workflow name</Text>
                <Text className="data-table-detail content" component={ TextVariants.p }>{ name }</Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text className="data-table-detail heading" component={ TextVariants.h5 }>Description</Text>
                <Text className="data-table-detail content" component={ TextVariants.p }>{ description }</Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text className="data-table-detail heading" component={ TextVariants.h5 }>Approval Stages</Text>
                { (stages !== undefined) && stages.map((stage, idx)  =>
                  <Text key={ stage.value }
                    className="data-table-detail content"
                    component={ TextVariants.p }>
                    { `Stage ${idx + 1} : ${formData.groupOptions.find(group => group.value === stages[idx].stage).label}` }
                  </Text>) }
              </TextContent>
            </StackItem>
          </Stack>
        </StackItem>
      </Stack>
    </Fragment>
  );
};

SummaryContent.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  groups: PropTypes.array
};

export default SummaryContent;

