const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const App = require('./app');

describe('app', () => {
	let app;
	let logger;
	let server;
	let controller;

	beforeEach(() => {
		controller = {
			run: sinon.stub()
		};
		server = {
			listen: sinon.stub()
		};
		logger = {
			info: sinon.stub()
		};
		app = new App(logger, server, controller);
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

		it('starts server.listen on port 1337', () => {
			expect(server.listen).to.have.been.calledWith(1337);
		});

		it('logs info about the successful start', () => {
			expect(logger.info).to.have.been.calledWith(app, 'App has been started on port 1337');
		});

		it('runs controllers', () => {
			expect(controller.run).to.have.been.calledWith();
		});
	});
});
