var defaults = {
    contentType: "application/json"
};

function promiseFromJqueryAjax ( $promise ) {
    return new Promise(function ( resolve, reject ) {

        $promise.done(function ( r ) {

            if (r.success === false) {
                reject(r);
            }

            if (r.success === true) {
                resolve(r.data);
            }
        });

        $promise.error(function ( r ) {
            //TODO: do something with `r` here...
            reject({
                success: false,
                code: r.status,
                message: r.statusText,
                data: r
            });
        });

    });
}

var $http = {

    get: function ( urlOrOptions, data ) {
        var options = Object.assign({}, defaults, {type: "GET"});

        if (typeof urlOrOptions === 'string') {
            options.url = urlOrOptions;
        } else {
            Object.assign(options, urlOrOptions);
        }

        if (data !== undefined) {
            options.data = data;
        }

        return promiseFromJqueryAjax($.ajax(options));

    },

    post: function ( urlOrOptions, data ) {
        var options = Object.assign({}, defaults, {type: "POST"});

        if (typeof urlOrOptions === 'string') {
            options.url = urlOrOptions;
        } else {
            Object.assign(options, urlOrOptions);
        }

        if (data !== undefined) {
            options.data = data;
        }

        options.data = JSON.stringify(data);

        return promiseFromJqueryAjax($.ajax(options));

    },

    put: function ( urlOrOptions, data ) {
        var options = Object.assign({}, defaults, {type: "PUT"});

        if (typeof urlOrOptions === 'string') {
            options.url = urlOrOptions;
        } else {
            Object.assign(options, urlOrOptions);
        }

        if (data !== undefined) {
            options.data = data;
        }

        options.data = JSON.stringify(data);

        return promiseFromJqueryAjax($.ajax(options));
    }
};

module.exports = $http;