const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const Controller = require('../common/controller');
const ItemController = require('./item-controller');

describe('ItemController', () => {
	let controller;
	let server;

	beforeEach(() => {
		controller = new ItemController({}, {}, {});
		server = {
			get: sinon.stub(),
			post: sinon.stub()
		};
	});

	it('extends controller', () => {
		expect(controller).to.be.an.instanceof(Controller);
	});

	it('sets the routes up', () => {
		controller.setupRoutes(server);
		expect(server.get).to.have.been.calledWith('/item');
		expect(server.post).to.have.been.calledWith('/item');
	});
});
