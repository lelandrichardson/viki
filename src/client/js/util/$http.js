var parse = function ( req ) {
    var result;
    try {
        result = JSON.parse(req.responseText);
    }
    catch (e) {
        result = req.responseText;
    }
    return [result, req];
};

var xhr = function ( type, url, data ) {
    return new Promise(function ( resolve, reject ) {
        var XHR = window.XMLHttpRequest || ActiveXObject;
        var request = new XHR('MSXML2.XMLHTTP.3.0');
        request.open(type, url, true);
        request.setRequestHeader('Content-type', 'application/json');
        request.onreadystatechange = function () {
            var response;
            if (request.readyState === 4) {
                response = parse(request);

                if (request.status >= 200 && request.status < 300) {
                    if (response.success === false) {
                        reject(r);
                    }

                    if (response.success === true) {
                        resolve(response.data);
                    }

                    resolve(response);
                } else {
                    // TODO: this isn't quite right any more...
                    reject({
                        success: false,
                        code: response.status,
                        message: response.statusText,
                        data: response
                    });
                }
            }
        };
        request.send(JSON.stringify(data));
    });
};

module.exports = {
    get: function ( url ) {
        return xhr("GET", url);
    },

    put: function ( url, data ) {
        return xhr("PUT", url, data);
    },

    post: function ( url, data ) {
        return xhr("POST", url, data);
    },

    "delete": function ( url ) {
        return xhr("DELETE", url);
    },

    xhr: xhr
};