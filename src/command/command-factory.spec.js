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
		firstPrototype.cloneForItem = sinon.stub().returns(firstCommand);
		secondPrototype.cloneForItem = sinon.stub().returns(secondCommand);
		thirdPrototype.cloneForItem = sinon.stub().returns(thirdCommand);
		factory = new CommandFactory(firstPrototype, secondPrototype, thirdPrototype);
	});

	describe('#createFirstCommand', () => {
		it('creates a command instance from first registered prototype', () => {
			let command = factory.createFirstCommand(item);
			expect(firstPrototype.cloneForItem).to.have.been.calledWith(item);
			expect(command).to.equal(firstCommand);
		});
	});

	describe('#createNextCommand', () => {
		it('creates a command instance from next registered prototype', () => {
			let command = factory.createNextCommand(firstCommand, item);
			expect(secondPrototype.cloneForItem).to.have.been.calledWith(item);
			expect(command).to.equal(secondCommand);
		});

		it('creates a command instance from next next registered prototype', () => {
			let command = factory.createNextCommand(secondCommand, item);
			expect(thirdPrototype.cloneForItem).to.have.been.calledWith(item);
			expect(command).to.equal(thirdCommand);
		});

		it('returns undefined if there is no next registered prototype', () => {
			let command = factory.createNextCommand(thirdCommand, item);
			expect(command).to.be.undefined;
		});
	});
});
