const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const test = require('../test');
const TransmissionService = require('./transmission-service');

describe('TransmissionService', () => {
	let service;
	let logger;
	let torrent;
	let clientFactory;
	let client;
	let torrentStateResult;

	beforeEach(() => {
		torrentStateResult = {
			arguments: {
				torrents: [{
					id: 'torrent-id'
				}]
			}
		};
		logger = {
			error: sinon.stub()
		};
		torrent = {
			magnetLink: 'magnet-link'
		};
		client = {
			torrentAdd: sinon.stub().resolves(),
			torrentGet: sinon.stub().resolves(torrentStateResult)
		};
		clientFactory = sinon.stub().returns(client);
		service = new TransmissionService(logger, clientFactory);
	});

	describe('#constructor', () => {
		it('creates a client from factory', () => {
			expect(clientFactory).to.have.been.calledWith({
				url: 'http://localhost:9091/transmission/rpc'
			});
		});
	});

	describe('#download', () => {
		it('logs an error in case of error rethrows', () => {
			client.torrentAdd.rejects(test.error);
			return service.download(torrent).then(() => {
				throw new Error('Not expected to resolve');
			}).catch(err => {
				expect(err).to.equal(test.error);
				expect(logger.error).to.have.been.calledWith(test.error);
			});
		});

		it('adds a torrent via magnetLink', () => {
			return service.download(torrent).then(() => {
				expect(client.torrentAdd).to.have.been.calledWith({
					filename: 'magnet-link'
				});
			});
		});
	});

	describe('#getState', () => {
		it('logs an error in case of error and rethrows', () => {
			client.torrentGet.rejects(test.error);
			return service.getState('torrent-id').then(() => {
				throw new Error('Not expected to resolve');
			}).catch(e => {
				expect(e).to.equal(test.error);
				expect(logger.error).to.have.been.calledWith(test.error);
			});
		});

		it('requests a state of the torrent', () => {
			return service.getState('torrent-id').then(() => {
				expect(client.torrentGet).to.have.been.calledWith(sinon.match({
					ids: ['torrent-id']
				}));
			});
		});

		it('returns "finished" when the torrent is finished', () => {
			torrentStateResult.arguments.torrents[0].isFinished = true;
			return service.getState('torrent-id').then(state => {
				expect(state).to.equal('finished');
			});
		});

		it('returns "stalled" when the torrent is stalled', () => {
			torrentStateResult.arguments.torrents[0].isStalled = true;
			return service.getState('torrent-id').then(state => {
				expect(state).to.equal('stalled');
			});
		});

		it('returns "downloading" when the torrent is downloading', () => {
			return service.getState('torrent-id').then(state => {
				expect(state).to.equal('downloading');
			});
		});

		it('returns "removed" when the torrent is removed', () => {
			torrentStateResult.arguments.torrents = [];
			return service.getState('torrent-id').then(state => {
				expect(state).to.equal('removed');
			});
		});
	});
});
