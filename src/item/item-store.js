const ExtendedDatastore = require('../common/extended-datastore');
const Item = require('./item');

class ItemStore extends ExtendedDatastore {
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
