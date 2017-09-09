const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const ControllerUtil = require('./controller-util');

describe('ControllerUtil', () => {
	let util;
	let logger;
	let errors;
	let next;

	beforeEach(() => {
		logger = {
			error: sinon.stub()
		};
		errors = {
			InternalServerError: sinon.stub()
		};
		next = sinon.stub();
		util = new ControllerUtil(errors, logger);
	});

	describe('#handleError', () => {
		let error;

		beforeEach(() => {
			error = new Error('some generic error');
			util.handleError(error, next);
		});

		it('logs the error', () => {
			expect(logger.error).to.have.been.calledWith(error);
		});

		it('calls next() with a generic internal server error', () => {
			expect(next).to.have.been.calledWith(new errors.InternalServerError());
		});
	});
});
