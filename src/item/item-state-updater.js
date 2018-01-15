class ItemStateUpdater {
	constructor(itemStateStore, itemStatePublisher) {
		this.itemStateStore = itemStateStore;
		this.itemStatePublisher = itemStatePublisher;
	}

	update(item, newState) {
		const query = {
			item: item._id
		};
		const setter = {
			$set: {
				state: newState
			}
		};
		const options = {
			returnUpdatedDocs: true,
			upsert: true
		};
		return this.itemStateStore.update(query, setter, options)
			.then(updatedItemState => this.itemStatePublisher.publish(updatedItemState));
	}
}

module.exports = ItemStateUpdater;
module.exports['@singleton'] = true;
module.exports['@require'] = ['./item-state-store', './item-state-publisher'];
