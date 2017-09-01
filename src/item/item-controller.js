const Controller = require('../common/controller');

class ItemController extends Controller {
	constructor(store, errors, logger) {
		super(errors, logger);
		this.store = store;
	}

	setupRoutes(server) {
		server.get('/items', this.find.bind(this));
		server.post('/items', this.add.bind(this));
		// server.get('/item/imdb/:imdbId', this.findByImdbId.bind(this));
	}

	// findByImdbId(req, res, next) {
	// 	return this.store.findOne({ 'externalIds.map.imdb' : req.params.imdbId }).then(items => {
	// 		res.send(items);
	// 		next();
	// 	}).catch(err => this._handleError(err, next));
	// }


}

module.exports = ItemController;
module.exports['@singleton'] = true;
module.exports['@require'] = ['./item-store', 'restify-errors', '../logger'];
