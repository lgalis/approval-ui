import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/components/cjs/PageHeader';
import { DataList } from '@patternfly/react-core';
import { Request }  from './request';
import { DataListLoader } from '../../../presentational-components/shared/loader-placeholders';
import { useIntl } from 'react-intl';
import requestsMessages from '../../../messages/requests.messages';

const RequestList = ({ isLoading, items, noItems, indexpath }) => {
  const [ expanded, setExpanded ] = useState([]);
  const intl = useIntl();

  const toggleExpand = id => {
    const index = expanded.indexOf(id);
    const newExpanded =
      index >= 0 ? [ ...expanded.slice(0, index), ...expanded.slice(index + 1, expanded.length) ] : [ ...expanded, id ];

    setExpanded(newExpanded);
  };

  const isExpanded = key => expanded.includes(key);

  return (
    <Fragment>
      <div>
        { isLoading && (
          <Fragment>
            <PageHeader>
              <PageHeaderTitle title={ noItems }/>
            </PageHeader>
            <DataListLoader/>
          </Fragment>
        ) }
      </div>
      { items.length > 0 && (
        <DataList aria-label={ intl.formatMessage(requestsMessages.expandableDataList) }>
          { items.map((item, idx) => (
            <Request
              key={ item.id }
              item={ item }
              idx={ idx }
              isActive={ idx === 0 }
              isExpanded={ isExpanded(`request-${item.id}`) }
              toggleExpand={ toggleExpand }
              indexpath={ indexpath }
            />)) }
        </DataList>)
      }
    </Fragment>
  );
};

RequestList.propTypes = {
  isLoading: PropTypes.bool,
  items: PropTypes.array,
  noItems: PropTypes.string,
  active_request: PropTypes.number,
  indexpath: PropTypes.object
};

RequestList.defaultProps = {
  items: []
};

export default RequestList;

