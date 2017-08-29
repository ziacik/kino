class App {
	constructor(logger, restify, restifyPlugins) {
		this.logger = logger;
		this.restify = restify;
		this.restifyPlugins = restifyPlugins;
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

		server.listen(1337, () => {
			this.setupRoutes(server);
			this.logger.log(`Server is listening on port 1337`);
		});
	}

	setupRoutes() {}
}

module.exports = App;
module.exports['@singleton'] = true;
module.exports['@require'] = ['restify', 'restify-plugins'];
