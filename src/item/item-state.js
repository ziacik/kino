const { Model } = require('nedb-models');

class ItemState extends Model {
	static get keys() {
		return {
			item: {
				required: true
			},
			state: {
				required: true
			}
		};
	}

	static get timestamps() {
		return true;
	}
}

module.exports = ItemState;
