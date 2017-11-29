class Logger {
	info(sourceComponent, ...args) {
		let serializedArgs = args.map(it => it.toString());
		/* eslint-disable no-console */
		console.log(new Date(), sourceComponent.constructor.name, ...serializedArgs);
		/* eslint-enable no-console */
	}

	error(sourceComponent, ...args) {
		let serializedArgs = args.map(it => this._serializeExceptForError(it));
		/* eslint-disable no-console */
		console.error(new Date(), sourceComponent.constructor.name, ...serializedArgs);
		/* eslint-enable no-console */
	}

	warn(sourceComponent, ...args) {
		let serializedArgs = args.map(it => it.toString());
		/* eslint-disable no-console */
		console.warn(new Date(), sourceComponent.constructor.name, ...serializedArgs);
		/* eslint-enable no-console */
	}

	debug(sourceComponent, ...args) {
		let serializedArgs = args.map(it => it.toString());
		/* eslint-disable no-console */
		console.log(new Date(), sourceComponent.constructor.name, ...serializedArgs);
		/* eslint-enable no-console */
	}

	_serializeExceptForError(arg) {
		return arg instanceof Error ? arg : arg.toString();
	}
}

module.exports = Logger;
module.exports['@singleton'] = true;
