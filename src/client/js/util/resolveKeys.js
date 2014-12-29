var resolveKeys = function ( object ) {
    return new Promise(function ( resolve, reject ) {
        var keys = Object.keys(object),
            pending = keys.length,
            results = {},
            key,
            i;

        if (pending === 0) {
            return Promise.resolve();
        }

        function settler ( k ) {
            return function settleKey ( result ) {
                results[k] = result;

                if (--pending === 0) {
                    resolve(results);
                }
            };
        }

        for (i = 0; i < keys.length; i++) {
            key = keys[i];
            object[key].then(settler(key), reject);
        }
    });
};

module.exports = resolveKeys;