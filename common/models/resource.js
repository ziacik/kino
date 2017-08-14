'use strict';

const TvdbApi = require('node-tvdb');
const tvdbApi = new TvdbApi('3B61F18B2D8AD7AB');

function createShowResources(Resource, tvdbData) {
	return tvdbData.map(one => {
		let resource = new Resource();
		resource.type = 'show';
		resource.title = one.seriesName;
		return one;
	});
}

module.exports = function(Resource) {
	/**
	 * Discovers resources from external source (like tvdb)
	 * @param {string} query A query for the discovery (name)
	 * @param {Function(Error, array)} callback
	 */
	Resource.discover = function(query, callback) {
	  tvdbApi.getSeriesByName(query)
	  	.then(data => createShowResources(Resource, data))
		.then(resources => callback(null, resources));
	};
};
