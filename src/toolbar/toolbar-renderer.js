import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import toolbarMapper from './toolbar-mapper';

const ToolbarContext = createContext();

const Component = ({ component, ...props }) => (
  <ToolbarContext.Consumer>
    { ({ componentMapper }) => {
      const C =
            typeof component === 'string' ? componentMapper[component] : component;
      return <C { ...props } />;
    } }
  </ToolbarContext.Consumer>
);

Component.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
    PropTypes.element
  ]).isRequired
};

/**
 * Render loop that renders all toolbar components based on its type
 * @param {Array} fields list of React components to be rendered
 */
const render = (fields) =>
  fields.hidden
    ? null
    : fields.map(({ fields, key, ...field }) =>
      fields ? (
        <Component key={ key } { ...field }>
          { render(fields) }
        </Component>
      ) : (
        <Component key={ key } { ...field } />
      )
    );

const ToolbarRenderer = ({ schema, componentMapper }) => (
  <ToolbarContext.Provider value={ { render, componentMapper } }>
    { render(schema.fields) }
  </ToolbarContext.Provider>
);

ToolbarRenderer.propTypes = {
  schema: PropTypes.shape({
    fields: PropTypes.array.isRequired
  }).isRequired,
  componentMapper: PropTypes.object
};

ToolbarRenderer.defaultProps = {
  componentMapper: toolbarMapper
};

export default ToolbarRenderer;
