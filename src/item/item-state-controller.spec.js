const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const test = require('../test');
const ItemStateController = require('./item-state-controller');

describe('ItemStateController', () => {
	let controller;
	let server;
	let itemStore;
	let itemStateStore;
	let item;
	let itemState;
	let missedItemState;
	let itemStateFactory;

	beforeEach(() => {
		missedItemState = { state: 'added' };
		itemStateFactory = {
			createFor: sinon.stub().returns(missedItemState)
		};
		item = { _id: 'item-id' };
		itemState = { item: 'item-id', state: 'some' };
		itemStore = {
			find: sinon.stub().resolves([item])
		};
		itemStateStore = {
			find: sinon.stub().resolves([itemState])
		};
		server = {
			get: sinon.stub(),
			post: sinon.stub()
		};
		controller = new ItemStateController(server, test.errors, test.logger, itemStateFactory, itemStateStore, itemStore);
		test.rethrowHandleError(controller);
	});

	it('sets the routes up', () => {
		controller.run();
		expect(server.get).to.have.been.calledWith('/items/states');
	});

	describe('search with imdb param', () => {
		let req, res, next;
		let promise;

		beforeEach(() => {
			res = {
				send: sinon.stub()
			};
			next = sinon.stub();
			req = {
				params: {
					imdb: 'tt1234'
				}
			};
			promise = controller.find(req, res, next);
		});

		it('handles an error from item search', () => {
			test.mockHandleError(controller);
			itemStore.find.rejects(test.error);
			return test.handlesErrors(controller, controller.find(req, res, next));
		});

		it('handles an error from item state search', () => {
			test.mockHandleError(controller);
			itemStateStore.find.rejects(test.error);
			return test.handlesErrors(controller, controller.find(req, res, next));
		});

		it('searches for items by imdb external id', () => {
			return promise.then(() => {
				expect(itemStore.find).to.have.been.calledWith({
					'externalIds.imdb': 'tt1234'
				});
			});
		});

		it('searches for item states for all items found', () => {
			return promise.then(() => {
				expect(itemStateStore.find).to.have.been.calledWith({
					item: ['item-id']
				});
			});
		});

		it('sends an item state for each item found', () => {
			return promise.then(() => {
				expect(res.send).to.have.been.calledWith([itemState]);
			});
		});

		it('sends a default item state for each item found which does not have a state yet', () => {
			itemStateStore.find.resolves([]);
			return promise.then(() => {
				expect(res.send).to.have.been.calledWith(sinon.match([missedItemState]));
			});
		});

		it('calls next', () => {
			return promise.then(() => {
				expect(next).to.have.been.called;
			});
		});
	});
});
