const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const FilteringService = require('./filtering-service');

describe('FilteringService', () => {
	let service;
	let item;
	let torrents;
	let torrent1;
	let torrent2;
	let torrent3;
	let filteredTorrents1;
	let filteredTorrents2;
	let filter1;
	let filter2;
	let logger;

	beforeEach(() => {
		logger = {
			debug: sinon.stub(),
			warn: sinon.stub()
		};
		item = {
			some: 'item'
		};
		torrent1 = { id: 1 };
		torrent2 = { id: 2 };
		torrent3 = { id: 3 };
		torrents = [torrent1, torrent2, torrent3];
		filteredTorrents1 = [torrent1, torrent2];
		filteredTorrents2 = [torrent2];
		filter1 = {
			filter: sinon.stub().resolves(filteredTorrents1)
		};
		filter2 = {
			filter: sinon.stub().resolves(filteredTorrents2)
		};
		service = new FilteringService(logger, filter1, filter2);
	});

	describe('filter', () => {
		it('applies a chain of filters', () => {
			return service.filter(item, torrents).then(() => {
				expect(filter1.filter).to.have.been.calledWith(item, torrents);
				expect(filter2.filter).to.have.been.calledWith(item, filteredTorrents1);
			});
		});

		it('returns the result from last of filters chain', () => {
			return service.filter(item, torrents).then(result => {
				expect(result).to.equal(filteredTorrents2);
			});
		});

		it('logs debug result', () => {
			return service.filter(item, torrents).then(result => {
				expect(logger.debug).to.have.been.calledWith(service, 'Filtering result for torrents found for item', item, 'is', result);
			});
		});

		it('logs warning if some filter fails and continues with other filters', () => {
			let error = new Error('some error');
			filter1.filter.rejects(error);
			return service.filter(item, torrents).then(() => {
				expect(logger.warn).to.have.been.calledWith(service, 'Filter', filter1, 'failed with', error);
				expect(filter2.filter).to.have.been.calledWith(item, torrents);
			});
		});
	});
});
