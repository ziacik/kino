class Logger {
	constructor(meld) {
		this.meld = meld;
	}

	register(obj) {
		this.meld.before(obj, /[a-z].*/, () => {
			const joinpoint = this.meld.joinpoint();
			this.log('Entering', joinpoint.target.constructor.name + '.' + joinpoint.method);
		});
		this.meld.after(obj, /[a-z].*/, result => {
			const joinpoint = this.meld.joinpoint();
			if (result instanceof Error) {
				this.log('Error in', joinpoint.target.constructor.name + '.' + joinpoint.method);
				this.error(result);
			} else {
				this.log('Leaving', joinpoint.target.constructor.name + '.' + joinpoint.method);
			}
		});
	}

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
module.exports['@require'] = ['meld'];
