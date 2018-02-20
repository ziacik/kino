class ItemController {
	constructor(server, util, store, commandManager) {
		this.server = server;
		this.util = util;
		this.store = store;
		this.commandManager = commandManager;
	}

	run() {
		this.server.get('/items', this.find.bind(this));
		this.server.post('/items', this.add.bind(this));
	}

	find(req, res, next) {
		return this.store.find({}).then(items => {
			res.send(items);
			next();
		}).catch(err => this.util.handleError(err, next));
	}

	async add(req, res, next) {
		try {
			const inserted = await this.store.insert(req.body);
			res.send(201, inserted);
			await this.commandManager.add(inserted);
			next();
		} catch(err) {
			this.util.handleError(err, next);
		}
	}
}

module.exports = ItemController;
module.exports['@singleton'] = true;
module.exports['@require'] = ['../server', '../common/controller-util', './item-store', '../command/command-manager'];
