const TvdbApi = require('node-tvdb');
const tvdbApi = new TvdbApi('3B61F18B2D8AD7AB');

module.exports = {
	discover: function(query) {
		return tvdbApi.getSeriesByName(query);
		// .then(data => createShowResources(Resource, data))
		// .then(resources => callback(null, resources));
	}
};
