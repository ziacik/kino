const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const CommandFactory = require('./command-factory');

describe('CommandFactory', () => {
	let factory;
	let item;
	let firstPrototype;
	let secondPrototype;
	let thirdPrototype;
	let firstCommand;
	let secondCommand;
	let thirdCommand;
	let previousCommandResult;

	class CommandOne {}
	class CommandTwo {}
	class CommandThree {}

	beforeEach(() => {
		item = {
			_id: 'item-id',
			some: 'item'
		};
		firstCommand = new CommandOne();
		secondCommand = new CommandTwo();
		thirdCommand = new CommandThree();
		firstPrototype = new CommandOne();
		secondPrototype = new CommandTwo();
		thirdPrototype = new CommandThree();
		firstPrototype.create = sinon.stub().returns(firstCommand);
		secondPrototype.create = sinon.stub().returns(secondCommand);
		thirdPrototype.create = sinon.stub().returns(thirdCommand);
		previousCommandResult = {
			some: 'result'
		};
		factory = new CommandFactory(firstPrototype, secondPrototype, thirdPrototype);
	});

	describe('#createFirstCommand', () => {
		it('creates a command instance from first registered prototype', () => {
			let command = factory.createFirstCommand(item);
			expect(firstPrototype.create).to.have.been.calledWith(item);
			expect(command).to.equal(firstCommand);
		});
	});

	describe('#createNextCommand', () => {
		it('creates a command instance from next registered prototype, uses previous command result as data', () => {
			let command = factory.createNextCommand(firstCommand, item, previousCommandResult);
			expect(secondPrototype.create).to.have.been.calledWith(item, previousCommandResult);
			expect(command).to.equal(secondCommand);
		});

		it('creates a command instance from next next registered prototype, uses previous command result as data', () => {
			let command = factory.createNextCommand(secondCommand, item, previousCommandResult);
			expect(thirdPrototype.create).to.have.been.calledWith(item, previousCommandResult);
			expect(command).to.equal(thirdCommand);
		});

		it('returns undefined if there is no next registered prototype', () => {
			let command = factory.createNextCommand(thirdCommand, item, previousCommandResult);
			expect(command).to.be.undefined;
		});
	});
});
