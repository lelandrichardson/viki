// es6 polyfill library
require('es6-shim');

// Promises per the es6 spec
require('es6-promise').polyfill();

// used to initialize Stores
window.Hydrate = require('./util/StoreHydrator').Hydrate;
