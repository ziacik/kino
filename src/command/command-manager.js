class CommandManager {
	constructor(logger, commandQueue, commandFactory) {
		this.logger = logger;
		this.commandQueue = commandQueue;
		this.commandFactory = commandFactory;
		this.commandItemMap = new WeakMap();
		this.commandQueue.on('done', (command, commandResult) => this._commandDone(command, commandResult));
		this.commandQueue.on('error', (command, e) => this._commandFailed(command, e));
	}

	add(item, currentCommand) {
		let command = currentCommand || this.commandFactory.createFirstCommand(item);
		this.commandItemMap.set(command, item);
		this.commandQueue.add(command, command.delay);
	}

	_commandDone(command, commandResult) {
		let item = this.commandItemMap.get(command);
		this.commandItemMap.delete(command);
		this._addNext(command, item, commandResult);
	}

	_commandFailed(command, error) {
		this.logger.error(error);
	}

	_addNext(afterCommand, forItem, commandResult) {
		let nextCommand = this.commandFactory.createNextCommand(afterCommand, forItem, commandResult);
		if (nextCommand) {
			this.commandItemMap.set(nextCommand, forItem);
			this.commandQueue.add(nextCommand, nextCommand.delay);
		}
	}
}

module.exports = CommandManager;
module.exports['@singleton'] = true;
module.exports['@require'] = ['../logger', './command-queue', './command-factory'];
