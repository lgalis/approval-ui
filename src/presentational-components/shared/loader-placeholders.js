import React, { Fragment } from 'react';
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
  FormGroup
} from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components';
import ContentLoader from 'react-content-loader';

export const RequestInfoBarLoader = () => (
  <ContentLoader
    height={ 500 }
    width={ 200 }
    speed={ 2 }
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="10" y="15" rx="0" ry="0" width="174" height="26" />
    <rect x="10" y="65" rx="0" ry="0" width="174" height="26" />
    <rect x="10" y="115" rx="0" ry="0" width="174" height="26" />
    <rect x="10" y="165" rx="0" ry="0" width="174" height="26" />
    <rect x="10" y="215" rx="0" ry="0" width="174" height="26" />
    <rect x="10" y="265" rx="0" ry="0" width="174" height="26" />
    <rect x="10" y="315" rx="0" ry="0" width="174" height="26" />
    <rect x="10" y="365" rx="0" ry="0" width="174" height="26" />
    <rect x="10" y="415" rx="0" ry="0" width="174" height="26" />
    <rect x="10" y="465" rx="0" ry="0" width="174" height="26" />
    <rect x="10" y="515" rx="0" ry="0" width="174" height="26" />
  </ContentLoader>
);

export const RequestLoader = ({ items, ...props }) => (
  <Fragment>
    <Section className="data-table-pane">
      <Grid gutter="md">
        <GridItem md={ 2 } className="detail-pane">
          <RequestInfoBarLoader/>
        </GridItem>
        <GridItem md={ 10 } className = "detail-pane">
          <DataList aria-label="datalist-placeholder" style={ { margin: 32 } }>
            { [ ...Array(items) ].map((_item, index) => (
              <DataListItem key={ index } aria-labelledby="datalist-item-placeholder">
                <DataListItemRow>
                  <DataListItemCells dataListCells={ [
                    <DataListCell key="1">
                      <ContentLoader
                        height={ 12 }
                        width={ 300 }
                        speed={ 2 }
                        primaryColor="#FFFFFF"
                        secondaryColor="#ecebeb"
                        { ...props }>
                        <rect x="0" y="0" rx="0" ry="0" width="300" height="12" />
                      </ContentLoader>
                    </DataListCell>
                  ] }
                  />
                </DataListItemRow>
              </DataListItem>
            )) }
          </DataList>
        </GridItem>
      </Grid>
    </Section>
  </Fragment>
);

RequestLoader.propTypes = {
  items: PropTypes.number
};

RequestLoader.defaultProps = {
  items: 5
};

export const AppPlaceholder = props => (
  <div>
    <ContentLoader
      height={ 16 }
      width={ 300 }
      speed={ 2 }
      primaryColor="#FFFFFF"
      secondaryColor="#FFFFFF"
      { ...props }>
      <rect x="0" y="0" rx="0" ry="0" width="420" height="10" />
    </ContentLoader>
    <RequestLoader />
  </div>
);

export const DataListLoader = ({ items, ...props }) => (
  <Fragment>
    <DataList aria-labelledby="datalist-placeholder" style={ { margin: 32 } }>
      { [ ...Array(items) ].map((_item, index) => (
        <DataListItem key={ index } aria-labelledby="datalist-item-placeholder">
          <DataListItemRow aria-label="datalist-item-placeholder-row">
            <DataListItemCells dataListCells={ [
              <DataListCell key="1">
                <ContentLoader
                  height={ 12 }
                  width={ 300 }
                  speed={ 2 }
                  primaryColor="#FFFFFF"
                  secondaryColor="#ecebeb"
                  { ...props }>
                  <rect x="0" y="0" rx="0" ry="0" width="300" height="12" />
                </ContentLoader>
              </DataListCell>
            ] }
            />
          </DataListItemRow>

        </DataListItem>
      )) }
    </DataList>
  </Fragment>
);

DataListLoader.propTypes = {
  items: PropTypes.number
};

DataListLoader.defaultProps = {
  items: 5
};

const FormItemLoader = () => (
  <ContentLoader
    height={ 36 }
    width={ 400 }
    speed={ 2 }
    primaryColor="#ffffff"
    secondaryColor="#ecebeb"
  >
    <rect x="0" y="0" rx="0" ry="0" width="400" height="36" />
  </ContentLoader>
);

export const WorkflowStageLoader = () => (
  <Form>
    <FormGroup fieldId="1">
      <FormItemLoader />
    </FormGroup>
    <FormGroup fieldId="2">
      <FormItemLoader />
    </FormGroup>
  </Form>
);
