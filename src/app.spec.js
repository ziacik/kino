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

	beforeEach(() => {
		server = {
			use: sinon.stub(),
			listen: sinon.stub().yields()
		};
		logger = {
			log: sinon.stub()
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
		app = new App(logger, restify, restifyPlugins);
	});

	describe('#run', () => {
		beforeEach(() => {
			app.run();
		});

		it('runs a server', () => {
			expect(restify.createServer).to.have.been.called;
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

		it('logs about the successful start', () => {
			expect(logger.log).to.have.been.calledWith(sinon.match('1337'));
		});
	});
});
