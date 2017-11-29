const { Model } = require('nedb-models');

class Item extends Model {
	static get keys() {
		return {
			name: {
				required: true
			},
			type: {
				required: true
			},
			year: {
				required: true
			},
			posterUrl: {
				required: false
			},
			externalIds: {
				required: false
			}
		};
	}

	static get timestamps() {
		return true;
	}

	toString() {
		return `${this.type} ${this.name}`;
	}
}

module.exports = Item;
