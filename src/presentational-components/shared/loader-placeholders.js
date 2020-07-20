import React from 'react';
import PropTypes from 'prop-types';
import {
  DataList,
  DataListCell,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  Grid,
  GridItem,
  Form,
  FormGroup,
  Stack,
  StackItem,
  Card,
  CardBody
} from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components/components/cjs/Section';
import { Main } from '@redhat-cloud-services/frontend-components/components/cjs/Main';

import clsx from 'clsx';

import './loader.scss';
import { TopToolbar, TopToolbarTitle } from './top-toolbar';

const Loader = ({ width = '100%', height = '100%', className, ...props }) => (
  <span
    { ...props }
    className={ clsx('ins__approval__loader', className) }
    style={ { width, height } }
  />
);

Loader.propTypes = {
  width: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  height: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  className: PropTypes.string
};

export const DataListLoader = ({ items }) => (
  <DataList aria-label="data-list-loader" aria-labelledby="datalist-placeholder">
    { [ ...Array(items) ].map((_item, index) => (
      <DataListItem key={ index } aria-labelledby="datalist-item-placeholder">
        <DataListItemRow aria-label="datalist-item-placeholder-row">
          <DataListItemCells dataListCells={ [
            <DataListCell key="1">
              <Loader height={ 64 } width='100%' />
            </DataListCell>
          ] }
          />
        </DataListItemRow>
      </DataListItem>
    )) }
  </DataList>
);

DataListLoader.propTypes = {
  items: PropTypes.number
};

DataListLoader.defaultProps = {
  items: 5
};

export const RequestLoader = () => (
  <div className="ins__approval__request_loader">
    <Grid hasGutter>
      <GridItem md={ 4 } lg={ 3 } className="info-bar">
        <Stack hasGutter>
          <StackItem>
            <Card>
              <CardBody>
                <Loader className="pf-u-mb-sm ins__approval__request_loader-card" />
              </CardBody>
            </Card>
          </StackItem>
        </Stack>
      </GridItem>
      <GridItem md={ 8 } lg={ 9 } className="detail-pane pf-u-p-lg">
        <DataListLoader/>
      </GridItem>
    </Grid>
  </div>
);

export const AppPlaceholder = () => (
  <Main className="pf-u-p-0 pf-u-ml-0">
    <TopToolbar className="ins__approval__placeholder_toolbar">
      <TopToolbarTitle/>
    </TopToolbar>
    <Section type="content">
      <DataListLoader />
    </Section>
  </Main>
);

export const FormItemLoader = () => <Loader height={ 64 } width='100%' />;

export const WorkflowInfoFormLoader = () => (
  <Form>
    <FormGroup fieldId="1">
      <FormItemLoader />
    </FormGroup>
    <FormGroup fieldId="2">
      <FormItemLoader />
    </FormGroup>
  </Form>
);

export const ToolbarTitlePlaceholder = () => <Loader height={ 32 } width={ 200 } className="pf-u-mb-md" />;
