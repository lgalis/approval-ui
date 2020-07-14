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
import { useIntl } from 'react-intl';
import formMessages from '../../../messages/form.messages';
import tableToolbarMessages from '../../../messages/table-toolbar.messages';

const SummaryContent = () => {
  const { getState } = useFormApi();
  const { name, description, wfGroups } = getState().values;
  const intl = useIntl();

  return (
    <Fragment>
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h6" size="xl">{ intl.formatMessage(formMessages.review) }</Title>
        </StackItem>
        <StackItem>
          <Stack hasGutter>
            <StackItem>
              <TextContent>
                <Text className="pf-u-mb-0" component={ TextVariants.small }>
                  { intl.formatMessage(formMessages.summaryDescription) }
                </Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <Grid hasGutter>
                <GridItem span={ 2 }>
                  <Text className="pf-u-mb-0" component={ TextVariants.small }>{ intl.formatMessage(tableToolbarMessages.name) }</Text>
                </GridItem>
                <GridItem span={ 10 }>
                  <Text className="pf-u-mb-md" component={ TextVariants.p }>{ name }</Text>
                </GridItem>
              </Grid>
              <Grid hasGutter>
                <GridItem span={ 2 }>
                  <Text className="pf-u-mb-0" component={ TextVariants.small }>{ intl.formatMessage(formMessages.description) }</Text>
                </GridItem>
                <GridItem span={ 10 }>
                  <Text className="pf-u-mb-md" component={ TextVariants.p }>{ description }</Text>
                </GridItem>
              </Grid>
              { wfGroups && wfGroups.length > 0 && wfGroups.map((group, idx) => (
                <Fragment key={ group.value }>
                  <Grid hasGutter>
                    <GridItem span={ 2 }>
                      <Text className="pf-u-mb-0" component={ TextVariants.small }>
                        { idx === 0 ? 'Groups' : '' }
                      </Text>
                    </GridItem>
                    <GridItem span={ 10 }>
                      <Text className="pf-u-mb-md" component={ TextVariants.p }>
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
