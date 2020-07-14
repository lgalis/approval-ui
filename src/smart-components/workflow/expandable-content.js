import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';
import { useIntl } from 'react-intl';
import formMessages from '../../messages/form.messages';

const ExpandableContent = ({ description, groupRefs }) => {
  const intl = useIntl();
  const listGroupNames = (groupRefs) => groupRefs.map((ref) => ref.name);

  return (
    <Fragment>
      <TextContent>
        <Text className="pf-u-mb-0" component={ TextVariants.small }>{ intl.formatMessage(formMessages.description) }</Text>
        <Text className="pf-u-mb-md" component={ TextVariants.p }>{ description }</Text>
      </TextContent>
      <TextContent>
        <Fragment>
          <Text className="pf-u-mb-0" component={ TextVariants.small }>{ intl.formatMessage(formMessages.groups) }</Text>
          <Text className="pf-u-mb-md"
            component={ TextVariants.p }>
            { listGroupNames(groupRefs).join(',') }
          </Text>
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
