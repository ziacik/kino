const { Datastore } = require('nedb-models');
const Item = require('./item');

class ItemStore extends Datastore {
	constructor() {
		super({
			filename: './db/item.db',
			autoload: true
		});
		this.attachModel(Item);
	}
}

module.exports = ItemStore;
module.exports['@singleton'] = true;
