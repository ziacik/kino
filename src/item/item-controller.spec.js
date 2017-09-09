const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const test = require('../test');
const ItemController = require('./item-controller');

describe('ItemController', () => {
	let controller;
	let server;
	let req;
	let res;
	let next;
	let util;
	let item;
	let insertedItem;
	let store;
	let commandManager;

	beforeEach(() => {
		commandManager = {
			add: sinon.stub()
		};
		util = {
			handleError: sinon.stub().resolves()
		};
		req = {};
		res = {
			send: sinon.stub()
		};
		next = sinon.stub();
		item = {
			some: 'item'
		};
		insertedItem = {
			_id: 'item-id',
			some: 'item'
		};
		store = {
			find: sinon.stub().resolves([item]),
			insert: sinon.stub().resolves(insertedItem)
		};
		controller = new ItemController(util, store, commandManager);
		server = {
			get: sinon.stub(),
			post: sinon.stub()
		};
	});

	it('sets the routes up', () => {
		controller.setupRoutes(server);
		expect(server.get).to.have.been.calledWith('/items');
		expect(server.post).to.have.been.calledWith('/items');
	});

	describe('#find', () => {
		it('handles an error with util', () => {
			store.find.rejects(test.error);
			return test.handlesErrors(util, controller.find(req, res, next));
		});

		describe('without a query', () => {
			it('sends all items from db', () => {
				return controller.find(req, res, next).then(() => {
					expect(res.send).to.have.been.calledWith([item]);
					expect(next).to.have.been.called;
				});
			});
		});
	});

	describe('#add', () => {
		beforeEach(() => {
			req.body = item;
		});

		it('handles an error with util', () => {
			store.insert.rejects(test.error);
			return test.handlesErrors(util, controller.add(req, res, next));
		});

		it('saves an item from the body', () => {
			return controller.add(req, res, next).then(() => {
				expect(store.insert).to.have.been.calledWith(item);
				expect(res.send).to.have.been.calledWith(201);
				expect(next).to.have.been.called;
			});
		});

		it('registers the inserted item to command manager', () => {
			return controller.add(req, res, next).then(() => {
				expect(commandManager.add).to.have.been.calledWith(insertedItem);
			});
		});
	});
});
