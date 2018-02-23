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
	let addUrlResult;
	let torrentStateResult;

	beforeEach(() => {
		addUrlResult = {
			id: 123,
			hashString: 'some-hash',
			name: 'torrent-name'
		};
		torrentStateResult = {
			torrents: [{
				status: 4
			}]
		};
		logger = {
			info: sinon.stub(),
			error: sinon.stub()
		};
		torrent = {
			magnetLink: 'magnet-link'
		};
		client = {
			addUrl: sinon.stub().yields(null, addUrlResult),
			get: sinon.stub().yields(null, torrentStateResult),
			status: {
				STOPPED: 0,
				SEED_WAIT: 5,
				SEED: 6,
				ISOLATED: 7
			}
		};
		clientFactory = sinon.stub().returns(client);
		service = new TransmissionService(logger, clientFactory);
	});

	describe('#constructor', () => {
		it('creates a client from factory', () => {
			expect(clientFactory).to.have.been.calledWith();
		});
	});

	describe('#download', () => {
		it('logs an error in case of error and rethrows', () => {
			client.addUrl.yields(test.error);
			return service.download(torrent).then(() => {
				throw new Error('Not expected to resolve');
			}).catch(err => {
				expect(err).to.equal(test.error);
				expect(logger.error).to.have.been.calledWith(service, 'Adding a torrent', torrent, 'failed with', test.error);
			});
		});

		it('adds a torrent via magnetLink', () => {
			return service.download(torrent).then(() => {
				expect(client.addUrl).to.have.been.calledWith('magnet-link');
			});
		});

		it('logs info', () => {
			return service.download(torrent).then(() => {
				expect(logger.info).to.have.been.calledWith(service, 'Torrent', torrent, 'has been added');
			});
		});
	});

	describe('#getState', () => {
		it('logs an error in case of error and rethrows', () => {
			client.get.yields(test.error);
			return service.getState('torrent-id').then(() => {
				throw new Error('Not expected to resolve');
			}).catch(e => {
				expect(e).to.equal(test.error);
				expect(logger.error).to.have.been.calledWith(service, 'Requesting state of the torrent', 'torrent-id', 'failed with', test.error);
			});
		});

		it('requests a state of the torrent', () => {
			return service.getState('torrent-id').then(() => {
				expect(client.get).to.have.been.calledWith(['torrent-id']);
			});
		});

		it('returns "finished" when the torrent is stopped', () => {
			torrentStateResult.torrents[0].status = client.status.STOPPED;
			return service.getState('torrent-id').then(state => {
				expect(state).to.equal('finished');
			});
		});

		it('returns "finished" when the torrent is seeding', () => {
			torrentStateResult.torrents[0].status = client.status.SEED;
			return service.getState('torrent-id').then(state => {
				expect(state).to.equal('finished');
			});
		});

		it('returns "finished" when the torrent is about to be seeding', () => {
			torrentStateResult.torrents[0].status = client.status.SEED_WAIT;
			return service.getState('torrent-id').then(state => {
				expect(state).to.equal('finished');
			});
		});

		it('returns "stalled" when the torrent is stalled', () => {
			torrentStateResult.torrents[0].status = client.status.ISOLATED;
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
			torrentStateResult.torrents = [];
			return service.getState('torrent-id').then(state => {
				expect(state).to.equal('removed');
			});
		});
	});
});
