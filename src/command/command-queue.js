const EventEmitter = require('events');

class CommandQueue extends EventEmitter {
	constructor(logger) {
		super();
		this.logger = logger;
		this.commands = [];
	}

	add(command, postponeMillis) {
		if (postponeMillis) {
			let now = Date.now();
			command.postponedUntil = new Date(now + postponeMillis);
		}

		this._process(command);
	}

	_process(command) {
		/// If other command is already executing, just add the command to the queue.
		if (this.executing) {
			this.commands.push(command);
			return;
		}

		/// If other command is already planned and current one should be run later, just add it to the queue.
		if (this.nearestPlannedCommand && !this._isEarlierThanPlanned(command)) {
			this.commands.push(command);
			return;
		}

		/// Otherwise, plan, replan or execute the command.
		this._planOrExecute(command);
	}

	_isEarlierThanPlanned(command) {
		if (!command.postponedUntil) {
			return true;
		}

		return command.postponedUntil < this.nearestPlannedCommand.postponedUntil;
	}

	_planOrExecute(command) {
		/// If there already is another command planned, reset its timer and put it back to queue.
		if (this.nearestPlannedCommand) {
			clearTimeout(this.timeout);
			this.commands.push(this.nearestPlannedCommand);
		}

		let now = Date.now();

		/// The command is in future.
		if (command.postponedUntil && command.postponedUntil > now) {
			this.nearestPlannedCommand = command;
			this.timeout = setTimeout(() => this._execute(command), command.postponedUntil - now);
			return;
		}

		/// The command should execute immediately.
		this._execute(command);
	}

	_pickupNext() {
		if (!this.commands.length) {
			return;
		}

		let nearestCommand = this.commands[0];
		let nearestIndex = 0;

		this.commands.forEach((command, i) => {
			if (!nearestCommand.postponedUntil) {
				return;
			}

			if (!command.postponedUntil || command.postponedUntil < nearestCommand.postponedUntil) {
				nearestCommand = command;
				nearestIndex = i;
			}
		});

		this.commands.splice(nearestIndex, 1);
		this._process(nearestCommand);
	}

	_execute(command) {
		this.executing = command;
		this.nearestPlannedCommand = null;
		command.execute().then(() => {
			this.emit('done', command);
			this.executing = null;
			this._pickupNext();
		}).catch(e => {
			this._retry(command, e);
			this.executing = null;
			this._pickupNext();
		});
	}

	_retry(command, error) {
		const retryNo = command.retryNo || 0;
		if (retryNo >= (command.maxRetryCount || 0)) {
			this.emit('error', command, error);
			return;
		}

		command.retryNo = retryNo + 1;
		this.add(command, command.retryDelay);
	}
}

module.exports = CommandQueue;
module.exports['@singleton'] = true;
module.exports['@require'] = ['../logger'];
