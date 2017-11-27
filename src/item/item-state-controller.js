class ItemStateController {
	constructor(errors, logger, itemStateFactory, store, itemStore) {
		this.itemStateFactory = itemStateFactory;
		this.store = store;
		this.itemStore = itemStore;
		this.logger = logger;
		this.logger.register(this);
	}

	setupRoutes(server) {
		server.get('/items/states', this.find.bind(this));
	}

	find(req, res, next) {
		let query = {
			'externalIds.imdb': req.params.imdb
		};
		return this.itemStore.find(query).then(items => {
			let stateQuery = {
				item: items.map(it => it._id)
			};
			return this.store.find(stateQuery).then(itemStates => {
				let missed = items.filter(item => !itemStates.some(s => s.item === item._id));
				let defaultStates = missed.map(item => this.itemStateFactory.createFor(item));
				res.send(itemStates.concat(defaultStates));
				next();
			});
		}).catch(err => this.handleError(err, next));
	}
}

module.exports = ItemStateController;
module.exports['@singleton'] = true;
module.exports['@require'] = ['restify-errors', '../logger', './item-state-factory', './item-state-store', './item-store'];
