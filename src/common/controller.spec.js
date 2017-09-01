const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));
const test = require('../test');

const Controller = require('./controller');

describe('Controller', () => {
	let controller;
	let logger;
	let errors;
	let next;
	let req;
	let res;
	let store;
	let item;

	beforeEach(() => {
		logger = {
			error: sinon.stub()
		};
		errors = {
			InternalServerError: sinon.stub()
		};
		next = sinon.stub();
		req = {};
		res = {
			send: sinon.stub()
		};
		item = {
			some: 'item'
		};
		store = {
			find: sinon.stub().resolves([item]),
			insert: sinon.stub().resolves()
		};
		controller = new Controller(errors, logger, store);
	});

	describe('#handleError', () => {
		let error;

		beforeEach(() => {
			error = new Error('some generic error');
			controller.handleError(error, next);
		});

		it('logs the error', () => {
			expect(logger.error).to.have.been.calledWith(error);
		});

		it('calls next() with a generic internal server error', () => {
			expect(next).to.have.been.calledWith(new errors.InternalServerError());
		});
	});

	describe('#find', () => {
		beforeEach(() => {
			test.mockHandleError(controller);
		});

		it('handles an error', () => {
			store.find.rejects(test.error);
			return test.handlesErrors(controller, controller.find(req, res, next));
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
			test.mockHandleError(controller);
		});

		it('handles an error', () => {
			store.insert.rejects(test.error);
			return test.handlesErrors(controller, controller.add(req, res, next));
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
