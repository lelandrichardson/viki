var parse = function ( req ) {
    var result;
    try {
        result = JSON.parse(req.responseText);
    }
    catch ( e ) {
        result = req.responseText;
    }
    return result;
};

var defaults = {
    contentType: "application/json",
    stringify: true
};

var applyOptions = function ( request, options ) {
    if (options.contentType !== false) {
        request.setRequestHeader('Content-type', options.contentType);
    }
};

var transformData = function ( request, data, options ) {
    if (options.stringify) {
        data = JSON.stringify(data);
    }
    return data;
};

var params = function ( obj ) {
    var pairs = [];

    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            var k = encodeURIComponent(prop),
                v = encodeURIComponent(obj[prop]);
            pairs.push(k + "=" + v);
        }
    }

    return pairs.join("&");
};

var xhr = function ( type, url, data, options ) {
    return new Promise(function ( resolve, reject ) {
        var XHR = window.XMLHttpRequest || ActiveXObject;
        var request = new XHR('MSXML2.XMLHTTP.3.0');

        options = Object.assign({}, defaults, options || {});

        request.open(type, url, true);

        applyOptions(request, options);

        request.onreadystatechange = function () {
            var response;
            if (request.readyState === 4) {
                response = parse(request);

                if (request.status >= 200 && request.status < 300) {
                    if (response.success === false) {
                        reject(response);
                    }

                    if (response.success === true) {
                        resolve(response.data);
                    }

                    resolve(response);
                } else {
                    // TODO: this isn't quite right after migrating from jQuery
                    reject({
                        success: false,
                        code: response.status,
                        message: response.statusText,
                        data: response
                    });
                }
            }
        };
        request.send(transformData(request, data, options));
    });
};

module.exports = {
    get: function ( url, data, options ) {
        return xhr("GET", url + (data ? "?" + params(data) : ""), null, options);
    },

    put: function ( url, data, options ) {
        return xhr("PUT", url, data, options);
    },

    post: function ( url, data, options ) {
        return xhr("POST", url, data, options);
    },

    "delete": function ( url, options ) {
        return xhr("DELETE", url, null, options);
    },

    xhr: xhr,

    params: params
};