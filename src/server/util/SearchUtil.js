function escapeRegex ( query ) {
    return query.replace(/[\-\[\]\/\{}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function queryToRegex ( query ) {
    return new RegExp(escapeRegex(query), "i");
}

module.exports = {
    escapeRegex: escapeRegex,
    queryToRegex: queryToRegex
};