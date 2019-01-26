// require('babel-register')({
//   // NOTE: If `dynamic-import-node` is in .babelrc alongside
//   // `syntax-dynamic-import` it breaks webpack's bundle
//   // splitting capability. Only load during runtime on the node-side
//   presets: ['es2017', 'stage-0', 'react'],
//   plugins: ['dynamic-import-node'],
// });

// All subsequent files required by node with the extensions .es6, .es, .jsx and .js will be transformed by Babel.
require('babel-register');

// Server Driver Code, everything from here on can use all the super future ES6 features!
module.exports = require('./server.js');
