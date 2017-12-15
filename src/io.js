module.exports = function(server, socketio) {
	return socketio.listen(server.server);
};

module.exports['@singleton'] = true;
module.exports['@require'] = [
	'./server',
	'socket.io'
];
