const ItemState = require('./item-state');

class ItemStateFactory {
	createFor(item) {
		let itemState = new ItemState();
		itemState.item = item._id;
		itemState.state = 'added';
		return itemState;
	}
}

module.exports = ItemStateFactory;
