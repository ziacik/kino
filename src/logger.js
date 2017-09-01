class Logger {
	log(...args) {
		/* eslint-disable no-console */
		console.log(args);
		/* eslint-enable no-console */
	}

	error(error) {
		/* eslint-disable no-console */
		console.error(error);
		/* eslint-enable no-console */
	}
}

module.exports = Logger;
module.exports['@singleton'] = true;
