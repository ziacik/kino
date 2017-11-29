class CommandManager {
	constructor(logger, commandQueue, firstCommandFactory) {
		this.logger = logger;
		this.commandQueue = commandQueue;
		this.firstCommandFactory = firstCommandFactory;
		this.commandQueue.on('done', (command, nextCommand) => this._commandDone(command, nextCommand));
		this.commandQueue.on('error', (command, e) => this._commandFailed(command, e));
	}

	add(item, currentCommand) {
		let command = currentCommand || this.firstCommandFactory.create(item);
		this.commandQueue.add(command, command.delay);
	}

	_commandDone(command, nextCommand) {
		if (nextCommand) {
			this.logger.info(this, 'Command', command, 'finished successfully, continuing with next command');
		} else {
			this.logger.info(this, 'Command', command, 'finished successfully, no next command');
		}

		if (nextCommand) {
			this.commandQueue.add(nextCommand, nextCommand.delay);
		}
	}

	_commandFailed(command, error) {
		this.logger.error(this, 'Command', command, 'failed with error', error);
	}
}

module.exports = CommandManager;
module.exports['@singleton'] = true;
module.exports['@require'] = ['../logger', './command-queue', '../torrent/torrent-search-command-factory'];
