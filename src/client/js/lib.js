// polyfill library
require('es6-shim');

// used to initialize Stores
window.Hydrate = require('./util/StoreHydrator').Hydrate;