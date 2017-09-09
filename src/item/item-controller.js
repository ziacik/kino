class ItemController {
	constructor(util, store, commandManager) {
		this.util = util;
		this.store = store;
		this.commandManager = commandManager;
	}

	setupRoutes(server) {
		server.get('/items', this.find.bind(this));
		server.post('/items', this.add.bind(this));
	}

	find(req, res, next) {
		return this.store.find({}).then(items => {
			res.send(items);
			next();
		}).catch(err => this.util.handleError(err, next));
	}

	add(req, res, next) {
		return this.store.insert(req.body).then(inserted => {
			res.send(201);
			this.commandManager.add(inserted);
			next();
		}).catch(err => this.util.handleError(err, next));
	}
}

module.exports = ItemController;
module.exports['@singleton'] = true;
module.exports['@require'] = ['../common/controller-util', './item-store', '../command/command-manager'];
