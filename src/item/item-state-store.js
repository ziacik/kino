const ExtendedDatastore = require('../common/extended-datastore');
const ItemState = require('./item-state');

class ItemStateStore extends ExtendedDatastore {
	constructor() {
		super({
			filename: './db/item.state.db',
			autoload: true
		});
		this.attachModel(ItemState);
	}
}

module.exports = ItemStateStore;
module.exports['@singleton'] = true;
