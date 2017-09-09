class CommandFactory {
	constructor(...commandPrototypes) {
		this.commandPrototypes = commandPrototypes;
	}

	createFirstCommand(forItem) {
		return this._createCommand(0, forItem);
	}

	createNextCommand(afterCommand, forItem, previousCommandResult) {
		let index = this.commandPrototypes.findIndex(it => it instanceof afterCommand.constructor);

		if (index < 0) {
			return;
		}

		return this._createCommand(index + 1, forItem, previousCommandResult);
	}

	_createCommand(prototypeIndex, forItem, previousCommandResult) {
		let prototype = this.commandPrototypes[prototypeIndex];

		if (prototype) {
			return prototype.create(forItem, previousCommandResult);
		}
	}
}

module.exports = CommandFactory;
module.exports['@singleton'] = true;
module.exports['@require'] = [
	'../torrent/torrent-search-command'
];
