module.exports = function(obj) {
	var key;
	for(key in obj) {
		obj[key] = key;
	}
	return obj;
};