class App {
	constructor(logger, restify, restifyPlugins, restifyCors, ...controllers) {
		this.logger = logger;
		this.restify = restify;
		this.restifyPlugins = restifyPlugins;
		this.restifyCors = restifyCors;
		this.controllers = controllers;
	}

	run() {
		const server = this.restify.createServer({
			name: 'Kino',
			version: '0.0.1',
		});

		server.use(this.restifyPlugins.jsonBodyParser({
			mapParams: true
		}));
		server.use(this.restifyPlugins.acceptParser(server.acceptable));
		server.use(this.restifyPlugins.queryParser({
			mapParams: true
		}));
		server.use(this.restifyPlugins.fullResponse());

		let cors = this.restifyCors({
			origins: ['*']
		});

		server.pre(cors.preflight);
		server.use(cors.actual);

		server.listen(1337, () => {
			this.setupRoutes(server);
			this.logger.info(this, 'Server has been started on port 1337');
		});
	}

	setupRoutes(server) {
		this.controllers.forEach(controller => controller.setupRoutes(server));
	}
}

module.exports = App;
module.exports['@singleton'] = true;
module.exports['@require'] = [
	'./logger',
	'restify',
	'restify-plugins',
	'restify-cors-middleware',
	'item/item-controller',
	'item/item-state-controller'
];
