require.extensions['.css'] = () => undefined;
const path = require('path');
const glob = require('glob');

const mapper = {
  TextVariants: 'Text',
  DropdownPosition: 'dropdownConstants',
  //TextListVariants: 'TextList',
  //TextListItemVariants: 'TextListItem'
};

module.exports = {
  presets: [ '@babel/preset-env', '@babel/preset-react' ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    'babel-plugin-lodash',
    [
      'transform-imports',
      {
        '@patternfly/react-core': {
          transform: (importName, matches) => {
            let res;
            const files = glob.sync(
              path.resolve(
                __dirname,
                `./node_modules/@patternfly/react-core/dist/js/**/${mapper[
                importName
                ] || importName}.js`
              )
            );
            if (files.length > 0) {
              res = files[0];
            } else {
              throw `File with importName ${importName} does not exist`;
            }

            res = res.replace(path.resolve(__dirname, './node_modules/'), '');
            res = res.replace(/^\//, '');
            return res;
          },
          preventFullImport: false,
          skipDefaultConversion: true
        }
      },
      'react-core'
    ],
    [
      'transform-imports',
      {
        '@patternfly/react-icons': {
          transform: (importName, matches) =>
            `@patternfly/react-icons/dist/js/icons/${importName
            .split(/(?=[A-Z])/)
            .join('-')
            .toLowerCase()}`,
          preventFullImport: true
        }
      },
      'react-icons'
    ]
  ]
};
