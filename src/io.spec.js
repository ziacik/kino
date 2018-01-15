const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const ioFactory = require('./io');

describe('io', () => {
	let serverWrapper;
	let socketio;
	let io;
	let ioResult = io;

	beforeEach(() => {
		serverWrapper = {
			server: {}
		};
		io = {};
		socketio = {
			listen: sinon.stub().returns(io)
		};
		ioResult = ioFactory(serverWrapper, socketio);
	});

	it('creates and returns io from socketio', () => {
		expect(socketio.listen).to.have.been.calledWith(serverWrapper.server);
		expect(ioResult).to.equal(io);
	});
});
