const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const ItemController = require('./item-controller');

describe('ItemController', () => {
	let controller;
	let logger;
	let errors;
	let req;
	let res;
	let next;
	let store;
	let item;
	let error;

	beforeEach(() => {
		error = new Error('some error');
		logger = {
			error: sinon.stub()
		};
		errors = {
			InternalServerError: sinon.stub()
		};
		req = {};
		res = {
			send: sinon.stub()
		};
		next = sinon.stub();
		item = {
			some: 'item'
		};
		store = {
			find: sinon.stub().resolves([item]),
			insert: sinon.stub().resolves()
		};
		controller = new ItemController(store, errors, logger);
	});

	function testError(promise) {
		store.find.rejects(error);
		return promise.then(() => {
			expect(res.send).not.to.have.been.called;
			expect(next).to.have.been.calledWith(new errors.InternalServerError());
			expect(logger.error).to.have.been.calledWith(error);
		});
	}

	describe('#find', () => {
		describe('without a query', () => {
			it('sends an error in case of error and logs it', () => {
				store.find.rejects(error);
				return testError(controller.find(req, res, next));
			});

			it('sends all items from db', () => {
				return controller.find(req, res, next).then(() => {
					expect(res.send).to.have.been.calledWith([item]);
					expect(next).to.have.been.called;
				});
			});
		});
	});

	describe('#add', () => {
		it('sends an error in case of error and logs it', () => {
			store.insert.rejects(error);
			return testError(controller.add(req, res, next));
		});

		it('saves an item from the body', () => {
			req.body = item;
			return controller.add(req, res, next).then(() => {
				expect(store.insert).to.have.been.calledWith(item);
				expect(res.send).to.have.been.calledWith(201);
				expect(next).to.have.been.called;
			});
		});
	});
});
