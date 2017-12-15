class ItemStatePublisher {
	constructor(io) {
		this.io = io;
	}

	publish(itemState) {
		this.io.emit('item-state', itemState);
	}
}

module.exports = ItemStatePublisher;
module.exports['@singleton'] = true;
module.exports['@require'] = ['../io'];
