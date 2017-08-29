/**
 * Item.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
	attributes: {
		name: {
			type: 'string',
			required: true
		},
		type: {
			type: 'string',
			required: true,
			in: ['movie', 'show', 'season', 'artist', 'album']
		},
		year: {
			type: 'string',
			required: true
		},
		bannerUrl: {
			type: 'string'
		},
		overview: {
			type: 'string'
		},
		externalIds: {
			type: 'json'
		}
	},
};
