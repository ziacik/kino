const Controller = require('../common/controller');

class ItemController extends Controller {
	constructor(errors, logger, store) {
		super(errors, logger);
		this.store = store;
	}

	setupRoutes(server) {
		server.get('/items', this.find.bind(this));
		server.post('/items', this.add.bind(this));
	}
}

module.exports = ItemController;
module.exports['@singleton'] = true;
module.exports['@require'] = ['restify-errors', '../logger', './item-store'];
