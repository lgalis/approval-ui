import React, { Fragment }  from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Text, TextContent, TextVariants, Level, LevelItem, Button, Title } from '@patternfly/react-core';

const ItemDetailDescription = ({ request }) => (
  <Fragment>
    <Title size="lg" > Stage(s) transcript </Title>
    <Level>
      <LevelItem>
        <TextContent>
          <Text className="data-table-detail heading" component={ TextVariants.small }>Product</Text>
          <Text className="data-table-detail content"
            component={ TextVariants.h5 }>{ request.content ? request.content.product : 'Unknown' }</Text>
        </TextContent>
      </LevelItem>
      <LevelItem>
        <Link to={ `/requests/approve/${request.id}` }>
          <Button variant="link" aria-label="Approve Request">
              Approve
          </Button>
        </Link>
        <Link to={ `/requests/deny/${request.id}` }>
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
            component={ TextVariants.h5 }>{ request.content ? request.content.portfolio : 'Unknown' }</Text>
        </TextContent>
        <TextContent>
          <Text className="data-table-detail heading" component={ TextVariants.small }>Platform</Text>
          <Text className="data-table-detail content"
            component={ TextVariants.h5 }>{ request.content ? request.content.platform : 'Unknown' }</Text>
        </TextContent>
        <TextContent>
          <Text className="data-table-detail heading" component={ TextVariants.small }>Comments</Text>
          <Text className="data-table-detail content"
            component={ TextVariants.h5 }>{ request.content ? request.content.comments : 'Unknown' }</Text>
        </TextContent>
      </LevelItem>

    </Level>
  </Fragment>
);

ItemDetailDescription.propTypes = {
  request: PropTypes.shape({
    content: PropTypes.object
  }).isRequired
};

export default ItemDetailDescription;

