const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
chai.use(require('sinon-chai'));

const ItemStateUpdater = require('./item-state-updater');

describe('ItemStateUpdater', () => {
	let updater;
	let publisher;
	let item;
	let itemStateStore;
	let itemState;

	beforeEach(() => {
		itemState = {
			item: 'some-item',
			state: 'some-state'
		};
		itemStateStore = {
			find: sinon.stub().resolves(itemState),
			update: sinon.stub().resolves()
		};
		item = {
			_id: 'some-item'
		};
		publisher = {
			publish: sinon.stub()
		};
		updater = new ItemStateUpdater(itemStateStore, publisher);
	});

	it('saves the updated ItemState', () => {
		return updater.update(item, 'new-state').then(() => {
			expect(itemStateStore.update).to.have.been.called;
			let args = itemStateStore.update.args[0];
			expect(args.length).to.equal(3);
			expect(args[0]).to.deep.equal({
				item: 'some-item'
			});
			expect(args[1]).to.deep.equal({
				$set: {
					state: 'new-state'
				}
			});
			expect(args[2]).to.deep.equal({
				returnUpdatedDocs: true
			});
		});
	});

	it('publishes the updated ItemState', () => {
		const updated = {
			_id: 'some-item',
			state: 'new-state'
		};
		itemStateStore.update.resolves(updated);
		return updater.update(item, 'new-state').then(() => {
			expect(publisher.publish).to.have.been.calledWith(updated);
		});
	});
});
