class Controller {
	constructor(errors, logger, store) {
		this.errors = errors;
		this.logger = logger;
		this.store = store;
	}

	handleError(err, next) {
		this.logger.error(err);
		next(new this.errors.InternalServerError());
	}

	find(req, res, next) {
		return this.store.find({}).then(items => {
			res.send(items);
			next();
		}).catch(err => this.handleError(err, next));
	}

	add(req, res, next) {
		return this.store.insert(req.body).then(() => {
			res.send(201);
			next();
		}).catch(err => this.handleError(err, next));
	}
}

module.exports = Controller;
