const { Datastore } = require('nedb-models');
const ItemState = require('./item-state');

class ItemStateStore extends Datastore {
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
