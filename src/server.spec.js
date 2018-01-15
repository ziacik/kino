const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const serverFactory = require('./server');

describe('server', () => {
	let restify;
	let restifyPlugins;
	let server;
	let corsMiddleware;
	let cors;
	let serverFactoryResult;

	beforeEach(() => {
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
		restify = {
			createServer: sinon.stub().returns(server)
		};
		restifyPlugins = {
			jsonBodyParser: sinon.stub().returns('jsonBodyParser'),
			acceptParser: sinon.stub().returns('acceptParser'),
			queryParser: sinon.stub().returns('queryParser'),
			fullResponse: sinon.stub().returns('fullResponse')
		};
		serverFactoryResult = serverFactory(restify, restifyPlugins, corsMiddleware);
	});

	it('returns a restify server', () => {
		expect(restify.createServer).to.have.been.called;
		expect(serverFactoryResult).to.equal(server);
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
});
