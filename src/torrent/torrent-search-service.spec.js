const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const test = require('../test');
const TorrentSearchService = require('./torrent-search-service');

describe('TorrentSearchService', () => {
	let service;
	let logger;
	let item;
	let engine1;
	let engine2;
	let torrent1;
	let torrent2;

	beforeEach(() => {
		logger = {
			warn: sinon.stub(),
			error: sinon.stub()
		};
		item = {
			name: 'some'
		};
		torrent1 = {
			magnet: 'some'
		};
		torrent2 = {
			magnet: 'another'
		};
		engine1 = {
			search: sinon.stub().resolves([torrent1])
		};
		engine2 = {
			search: sinon.stub().resolves([torrent2])
		};
		service = new TorrentSearchService(logger, engine1, engine2);
	});

	it('calls search on each registered search engine', () => {
		return service.search(item).then(() => {
			expect(engine1.search).to.have.been.calledWith(item);
			expect(engine2.search).to.have.been.calledWith(item);
		});
	});

	describe('if all engines succeed', () => {
		it('resolves to a result with success state and torrents from all engines', () => {
			return service.search(item).then(result => {
				expect(result.state).to.equal('success');
				expect(result.torrents).to.deep.equal([torrent1, torrent2]);
			});
		});
	});

	describe('if some of the engines fail', () => {
		beforeEach(() => {
			engine1.search.rejects(test.error);
		});

		it('resolves to a result with partial state and torrents from the engines that succeeded', () => {
			return service.search(item).then(result => {
				expect(result.state).to.equal('partial');
				expect(result.torrents).to.deep.equal([torrent2]);
			});
		});

		it('logs the warning', () => {
			return service.search(item).then(() => {
				expect(logger.warn).to.have.been.calledWith(service, 'Search engine', engine1, 'failed when searching for', item);
			});
		});
	});

	describe('if all engines fail', () => {
		it('resolves to a result with fail state and no torrents', () => {
			engine1.search.rejects(test.error);
			engine2.search.rejects(test.error);
			return service.search(item).then(result => {
				expect(result.state).to.equal('fail');
				expect(result.torrents).to.deep.equal([]);
			});
		});
	});
});
