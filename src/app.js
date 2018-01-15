class App {
	constructor(logger, server, ...controllers) {
		this.logger = logger;
		this.server = server;
		this.controllers = controllers;
	}

	run() {
		this.server.listen(1337);
		this.controllers.forEach(controller => controller.run());
		this.logger.info(this, 'App has been started on port 1337');
	}
}

module.exports = App;
module.exports['@singleton'] = true;
module.exports['@require'] = [
	'./logger',
	'./server',
	'item/item-controller',
	'item/item-state-controller'
];
