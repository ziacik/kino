const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const test = require('../test');
const CommandQueue = require('./command-queue');

describe.only('CommandQueue', () => {
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
});
