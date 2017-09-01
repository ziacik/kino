const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const ItemStateFactory = require('./item-state-factory');

describe('ItemStateFactory', () => {
	let factory;

	beforeEach(() => {
		factory = new ItemStateFactory();
	});

	describe('#createFor', () => {
		it('creates an item state for an item with a state of "added"', () => {
			let item = { _id: 'item-id' };
			let result = factory.createFor(item);
			expect(result.item).to.equal('item-id');
			expect(result.state).to.equal('added');
		});
	});
});
