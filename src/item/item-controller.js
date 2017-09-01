class ItemController {
	constructor(store, errors, logger) {
		this.store = store;
		this.errors = errors;
		this.logger = logger;
	}

	setupRoutes(server) {
		server.get('/item', this.find.bind(this));
		server.post('/item', this.add.bind(this));
		// server.get('/item/imdb/:imdbId', this.findByImdbId.bind(this));
	}

	// findByImdbId(req, res, next) {
	// 	return this.store.findOne({ 'externalIds.map.imdb' : req.params.imdbId }).then(items => {
	// 		res.send(items);
	// 		next();
	// 	}).catch(err => this._handleError(err, next));
	// }

	find(req, res, next) {
		return this.store.find({}).then(items => {
			res.send(items);
			next();
		}).catch(err => this._handleError(err, next));
	}

	add(req, res, next) {
		return this.store.insert(req.body).then(() => {
			res.send(201);
			next();
		}).catch(err => this._handleError(err, next));
	}

	_handleError(error, next) {
		this.logger.error(error);
		next(new this.errors.InternalServerError());
	}
}

module.exports = ItemController;
module.exports['@singleton'] = true;
module.exports['@require'] = ['./item-store', 'restify-errors', '../logger'];
