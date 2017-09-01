class Logger {
	log(...args) {
		/* eslint-disable no-console */
		console.log(args);
		/* eslint-enable no-console */
	}
}

module.exports = Logger;
module.exports['@singleton'] = true;
