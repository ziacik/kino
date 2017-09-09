const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const test = require('../test');
const CommandQueue = require('./command-queue');

describe('CommandQueue', () => {
	let queue;
	let logger;
	let command;
	let anotherCommand;

	beforeEach(() => {
		logger = {
			error: sinon.stub()
		};
		command = {
			execute: sinon.stub().resolves()
		};
		anotherCommand = {
			execute: sinon.stub().resolves()
		};
		queue = new CommandQueue(logger);
		queue.on('error', () => {});
	});

	function withLongRunningCommand() {
		command.execute.callsFake(() => {
			return new Promise(resolve => setTimeout(resolve, 200));
		});
	}

	it('executes an immediate command immediately', () => {
		queue.add(command);
		expect(command.execute).to.have.been.called;
	});

	it('executes a postponed command at the time at which it was postponed to', () => {
		queue.add(command, 100);
		expect(command.execute).not.to.have.been.called;

		return test.postponed(110, () => {
			expect(command.execute).to.have.been.called;
		});
	});

	it('when immediate command is added after postponed command, the immediate one runs immediately', () => {
		queue.add(anotherCommand, 10);
		queue.add(command);
		expect(command.execute).to.have.been.called;
	});

	it('when a postponed command is added after another postponed command, but the second one is planned for earlier, it will run first', () => {
		queue.add(anotherCommand, 200);
		queue.add(command, 100);
		expect(command.execute).not.to.have.been.called;
		expect(anotherCommand.execute).not.to.have.been.called;

		return test.postponed(110, () => {
			expect(command.execute).to.have.been.called;
			expect(anotherCommand.execute).not.to.have.been.called;
		}).then(() => test.postponed(100, () => {
			expect(anotherCommand.execute).to.have.been.called;
		}));
	});

	it('when another command is planned for the time at which previous command it still running, it will wait until it finishes and than executes immediately', () => {
		withLongRunningCommand();

		queue.add(command, 100);
		queue.add(anotherCommand, 200);

		expect(command.execute).not.to.have.been.called;
		expect(anotherCommand.execute).not.to.have.been.called;

		return test.postponed(210, () => {
			expect(command.execute).to.have.been.called;
			expect(anotherCommand.execute).not.to.have.been.called;
		}).then(() => test.postponed(100, () => {
			expect(anotherCommand.execute).to.have.been.called;
		}));
	});

	it('emits a done event when immediate command resolves', done => {
		queue.on('done', c => {
			try {
				expect(c).to.equal(command);
				done();
			} catch (e) {
				done(e);
			}
		});
		queue.add(command);
	});

	it('emits a done event when postponed command resolves', done => {
		queue.on('done', c => {
			try {
				expect(c).to.equal(command);
				done();
			} catch (e) {
				done(e);
			}
		});
		queue.add(command, 100);
	});

	it('does not emit an error event after success', done => {
		queue.on('error', () => done(new Error('Expected not to emit failed event')));
		queue.on('done', () => done());
		queue.add(command);
	});

	describe('when error occurs in execution', () => {
		beforeEach(() => {
			command.execute.rejects(test.error);
		});

		it('does not emit a done event', done => {
			queue.on('done', () => done(new Error('Expected not to emit finished event')));
			queue.on('error', () => done());
			queue.add(command);
		});

		it('emits an error event', done => {
			queue.on('error', (c, err) => {
				try {
					expect(c).to.equal(command);
					expect(err).to.equal(test.error);
					done();
				} catch (e) {
					done(e);
				}
			});
			queue.add(command);
		});

		it('emits an error event after last retry if the command is retryable', done => {
			command.maxRetryCount = 3;
			queue.on('error', (c, err) => {
				try {
					expect(c).to.equal(command);
					expect(c.retryNo).to.equal(3);
					expect(err).to.equal(test.error);
					done();
				} catch (e) {
					done(e);
				}
			});
			queue.add(command);
		});

		it('does not prevent next command in execution', () => {
			queue.add(command, 100);
			queue.add(anotherCommand, 200);

			return test.postponed(220, () => {
				expect(anotherCommand.execute).to.have.been.called;
			});
		});

		it('adds the command back to queue with retry delay if retry No. is lower than max', () => {
			queue.add(command);
			command.maxRetryCount = 2;
			command.retryDelay = 10;
			return test.postponed(1, () => {
				expect(command.execute).to.have.been.calledOnce;
			}).then(() => test.postponed(11, () => {
				expect(command.execute).to.have.been.calledTwice;
			})).then(() => test.postponed(11, () => {
				expect(command.execute).to.have.been.calledThrice;
			})).then(() => test.postponed(100, () => {
				expect(command.execute).to.have.been.calledThrice;
			}));
		});

		it('does not retry the command if there is no maxRetryCount', () => {
			queue.add(command);
			command.retryDelay = 10;
			return test.postponed(100, () => {
				expect(command.execute).to.have.been.calledOnce;
			});
		});
	});
});