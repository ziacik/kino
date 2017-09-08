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
	let factory;
	let item;
	let firstCommand;
	let nextCommand;
	let subscriptions = {};

	beforeEach(() => {
		logger = {
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
		firstCommand = { first: 'command' };
		nextCommand = { next: 'command', delay: 1234 };
		factory = {
			createFirstCommand: sinon.stub().returns(firstCommand),
			createNextCommand: sinon.stub()
		};
		factory.createNextCommand.withArgs(firstCommand, item).returns(nextCommand);
		factory.createNextCommand.withArgs(nextCommand, item).returns(null);
		manager = new CommandManager(logger, queue, factory);
	});

	describe('#add', () => {
		describe('without a command', () => {
			it('creates and enqueues the first command', () => {
				manager.add(item);
				expect(factory.createFirstCommand).to.have.been.calledWith(item);
				expect(queue.add).to.have.been.calledWith(firstCommand);
			});
		});

		describe('with a command', () => {
			it('enqueues the command', () => {
				manager.add(item, firstCommand);
				expect(factory.createFirstCommand).not.to.have.been.called;
				expect(queue.add).to.have.been.calledWith(firstCommand);
			});
		});
	});

	describe('when the command finishes successfully', () => {
		it('creates next command and enqueues it if it is not null', () => {
			manager.add(item, firstCommand);
			queue.add.reset();
			subscriptions.done(firstCommand);
			expect(factory.createNextCommand).to.have.been.calledWith(firstCommand, item);
			expect(queue.add).to.have.been.calledWith(nextCommand, 1234);
		});

		it('does not do anything more if there is no next command', () => {
			manager.add(item, nextCommand);
			queue.add.reset();
			subscriptions.done(nextCommand);
			expect(factory.createNextCommand).to.have.been.calledWith(nextCommand, item);
			expect(queue.add).not.to.have.been.called;
		});
	});

	describe('when the command fails', () => {
		it('logs the error and does not do anything else', () => {
			manager.add(item, firstCommand);
			queue.add.reset();
			subscriptions.error(firstCommand, test.error);
			expect(logger.error).to.have.been.calledWith(test.error);
			expect(factory.createNextCommand).not.to.have.been.called;
			expect(queue.add).not.to.have.been.called;
		});
	});
});
