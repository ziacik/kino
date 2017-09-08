class CommandFactory {
	constructor(...commandPrototypes) {
		this.commandPrototypes = commandPrototypes;
	}

	createFirstCommand(forItem) {
		return this._createCommand(0, forItem);
	}

	createNextCommand(afterCommand, forItem) {
		let index = this.commandPrototypes.findIndex(it => it instanceof afterCommand.constructor);

		if (index < 0) {
			return;
		}

		return this._createCommand(index + 1, forItem);
	}

	_createCommand(prototypeIndex, forItem) {
		let prototype = this.commandPrototypes[prototypeIndex];

		if (prototype) {
			return prototype.cloneForItem(forItem);
		}
	}
}

module.exports = CommandFactory;
module.exports['@singleton'] = true;
module.exports['@require'] = [
];
