const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const test = require('../test');
const CommandManager = require('./command-manager');

describe('CommandManager', () => {
	let manager;
	let logger;
	let queue;
	let item;
	let firstCommandFactory;
	let firstCommand;
	let nextCommand;
	let subscriptions = {};

	beforeEach(() => {
		logger = {
			info: sinon.stub(),
			error: sinon.stub()
		};
		item = {
			_id: 'item-id',
			some: 'item'
		};
		queue = {
			add: sinon.stub(),
			on: (eventName, callback) => subscriptions[eventName] = callback
		};
		firstCommand = {
			first: 'command',
			toString: () => 'First Command'
		};
		nextCommand = {
			next: 'command',
			delay: 1234
		};
		firstCommandFactory = {
			create: sinon.stub().returns(firstCommand)
		};
		manager = new CommandManager(logger, queue, firstCommandFactory);
	});

	describe('#add', () => {
		describe('without a command', () => {
			it('creates and enqueues the first command', () => {
				manager.add(item);
				expect(firstCommandFactory.create).to.have.been.calledWith(item);
				expect(queue.add).to.have.been.calledWith(firstCommand);
			});
		});

		describe('with a command', () => {
			it('enqueues the command', () => {
				manager.add(item, firstCommand);
				expect(firstCommandFactory.create).not.to.have.been.called;
				expect(queue.add).to.have.been.calledWith(firstCommand);
			});
		});
	});

	describe('when the command finishes successfully', () => {
		it('enqueues next command if the previous command created it', () => {
			manager.add(item, firstCommand);
			queue.add.reset();
			subscriptions.done(firstCommand, nextCommand);
			expect(queue.add).to.have.been.calledWith(nextCommand, 1234);
		});

		it('does not do anything more if there is no next command', () => {
			manager.add(item, nextCommand);
			queue.add.reset();
			subscriptions.done(nextCommand);
			expect(queue.add).not.to.have.been.called;
		});

		it('logs info with next command', () => {
			manager.add(item, firstCommand);
			subscriptions.done(firstCommand, nextCommand);
			expect(logger.info).to.have.been.calledWith(manager, 'Command', firstCommand, 'finished successfully, continuing with next command');
		});

		it('logs info with no next command', () => {
			manager.add(item, firstCommand);
			subscriptions.done(firstCommand);
			expect(logger.info).to.have.been.calledWith(manager, 'Command', firstCommand, 'finished successfully, no next command');
		});
	});

	describe('when the command fails', () => {
		it('logs the error and does not do anything else', () => {
			manager.add(item, firstCommand);
			queue.add.reset();
			subscriptions.error(firstCommand, test.error);
			expect(logger.error).to.have.been.calledWith(manager, 'Command', firstCommand, 'failed with error', test.error);
			expect(queue.add).not.to.have.been.called;
		});
	});
});
