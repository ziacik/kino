module.exports = function(restify, restifyPlugins, restifyCors) {
	const server = restify.createServer({
		name: 'Kino',
		version: '0.0.1',
	});

	server.use(restifyPlugins.jsonBodyParser({
		mapParams: true
	}));
	server.use(restifyPlugins.acceptParser(server.acceptable));
	server.use(restifyPlugins.queryParser({
		mapParams: true
	}));
	server.use(restifyPlugins.fullResponse());

	let cors = restifyCors({
		origins: ['*']
	});

	server.pre(cors.preflight);
	server.use(cors.actual);

	return server;
};

module.exports['@singleton'] = true;
module.exports['@require'] = [
	'restify',
	'restify-plugins',
	'restify-cors-middleware'
];
