var cache = {};

var Hydrate = function ( storeName, initialState ) {
    if (initialState === undefined) {
        return cache[storeName] || {};
    } else {
        cache[storeName] = initialState;
    }
};

exports.Hydrate = Hydrate;