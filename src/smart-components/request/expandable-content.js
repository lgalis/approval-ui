import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { TextContent, Text, TextVariants, Level, LevelItem, Button } from '@patternfly/react-core';

const ExpandableContent = ({ id, content }) => {
  console.log('ExpandableContent content: ', content);
  return (
    <Fragment>
      <Level>
        <LevelItem>
          <TextContent>
            <Text className="data-table-detail heading" component={ TextVariants.small }>Product</Text>
            <Text className="data-table-detail content"
              component={ TextVariants.h5 }>{ content ? content.product : 'Unknown' }</Text>
          </TextContent>
        </LevelItem>
        <LevelItem>
          <Link to={ `/requests/approve/${id}` }>
            <Button variant="link" aria-label="Approve Request">
                Approve
            </Button>
          </Link>
          <Link to={ `/requests/deny/${id}` }>
            <Button variant="link" className="destructive-color" aria-label="Deny Request">
                Deny
            </Button>
          </Link>
        </LevelItem>
      </Level>
      <Level>
        <LevelItem>
          <TextContent>
            <Text className="data-table-detail heading" component={ TextVariants.small }>Portfolio</Text>
            <Text className="data-table-detail content"
              component={ TextVariants.h5 }>{ content ? content.portfolio : 'Unknown' }</Text>
          </TextContent>
          <TextContent>
            <Text className="data-table-detail heading" component={ TextVariants.small }>Platform</Text>
            <Text className="data-table-detail content"
              component={ TextVariants.h5 }>{ content ? content.platform : 'Unknown' }</Text>
          </TextContent>
          <TextContent>
            <Text className="data-table-detail heading" component={ TextVariants.small }>Comments</Text>
            <Text className="data-table-detail content"
              component={ TextVariants.h5 }>{ content ? content.comments : 'Unknown' }</Text>
          </TextContent>
        </LevelItem>

      </Level>
    </Fragment>
  );
};

ExpandableContent.propTypes = {
  id: PropTypes.string,
  content: PropTypes.object
};
export default ExpandableContent;

