import React, { Fragment } from 'react';
import {
  Grid,
  GridItem,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
  Title
} from '@patternfly/react-core';

import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';

const SummaryContent = () => {
  const { getState } = useFormApi();
  const { name, description, wfGroups } = getState().values;

  return (
    <Fragment>
      <Stack gutter="md">
        <StackItem>
          <Title size="xl"> Review </Title>
        </StackItem>
        <StackItem>
          <Stack gutter="md">
            <StackItem>
              <TextContent>
                <Text className="data-table-detail heading" component={ TextVariants.h5 }>
                    Review and confirm your inputs. If there is anything incorrect, click Back and revise.</Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <Grid gutter="md">
                <GridItem span={ 2 }>
                  <Text className="data-table-detail heading" component={ TextVariants.h5 }>Name</Text>
                </GridItem>
                <GridItem span={ 10 }>
                  <Text className="data-table-detail content" component={ TextVariants.p }>{ name }</Text>
                </GridItem>
              </Grid>
              <Grid gutter="md">
                <GridItem span={ 2 }>
                  <Text className="data-table-detail heading" component={ TextVariants.h5 }>Description</Text>
                </GridItem>
                <GridItem span={ 10 }>
                  <Text className="data-table-detail content" component={ TextVariants.p }>{ description }</Text>
                </GridItem>
              </Grid>
              { wfGroups && wfGroups.length > 0 && wfGroups.map((group, idx) => (
                <Fragment key={ group.value }>
                  <Grid gutter="md">
                    <GridItem span={ 2 }>
                      <Text className="data-table-detail heading" component={ TextVariants.h5 }>
                        { idx === 0 ? 'Groups' : '' }
                      </Text>
                    </GridItem>
                    <GridItem span={ 10 }>
                      <Text className="data-table-detail content" component={ TextVariants.p }>
                        { group.label }
                      </Text>
                    </GridItem>
                  </Grid>
                </Fragment>)
              ) }
            </StackItem>
          </Stack>
        </StackItem>
      </Stack>
    </Fragment>
  );
};

export default SummaryContent;
