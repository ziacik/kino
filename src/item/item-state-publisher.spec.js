const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
chai.use(require('sinon-chai'));

const ItemStatePublisher = require('./item-state-publisher');

describe('ItemStatePublisher', () => {
	let publisher;
	let io;

	beforeEach(() => {
		io = {
			emit: sinon.stub()
		};
		publisher = new ItemStatePublisher(io);
	});

	it('emits an item-state event when item state is changed', () => {
		const itemState = {
			itemId: 'item-id',
			state: 'some-state'
		};
		publisher.publish(itemState);
		expect(io.emit).to.have.been.calledWith('item-state', itemState);
	});
});
