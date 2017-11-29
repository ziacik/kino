const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const App = require('./app');

describe('app', () => {
	let app;
	let logger;
	let restify;
	let restifyPlugins;
	let server;
	let corsMiddleware;
	let cors;
	let controller;

	beforeEach(() => {
		controller = {
			setupRoutes: sinon.stub()
		};
		cors = {
			preflight: 'cors-preflight',
			actual: 'cors-actual'
		};
		corsMiddleware = sinon.stub().returns(cors);
		server = {
			use: sinon.stub(),
			pre: sinon.stub(),
			listen: sinon.stub().yields()
		};
		logger = {
			info: sinon.stub()
		};
		restify = {
			createServer: sinon.stub().returns(server)
		};
		restifyPlugins = {
			jsonBodyParser: sinon.stub().returns('jsonBodyParser'),
			acceptParser: sinon.stub().returns('acceptParser'),
			queryParser: sinon.stub().returns('queryParser'),
			fullResponse: sinon.stub().returns('fullResponse')
		};
		app = new App(logger, restify, restifyPlugins, corsMiddleware, controller);
	});

	it('can be constructed via IoC container', () => {
		const container = require('electrolyte');

		container.use(container.dir('src'));
		container.use(container.node_modules());

		return container.create('app');
	});

	describe('#run', () => {
		beforeEach(() => {
			app.run();
		});

		it('runs a server', () => {
			expect(restify.createServer).to.have.been.called;
		});

		it('applies cors middleware', () => {
			expect(server.pre).to.have.been.calledWith('cors-preflight');
			expect(server.use).to.have.been.calledWith('cors-actual');
		});

		it('adds plugins to the server', () => {
			expect(server.use).to.have.been.calledWith('jsonBodyParser');
			expect(server.use).to.have.been.calledWith('acceptParser');
			expect(server.use).to.have.been.calledWith('queryParser');
			expect(server.use).to.have.been.calledWith('fullResponse');
		});

		it('starts listening', () => {
			expect(server.listen).to.have.been.calledWith(1337);
		});

		it('sets the routes up', () => {
			expect(controller.setupRoutes).to.have.been.calledWith(server);
		});

		it('logs info about the successful start', () => {
			expect(logger.info).to.have.been.calledWith(app, 'Server has been started on port 1337');
		});
	});
});
