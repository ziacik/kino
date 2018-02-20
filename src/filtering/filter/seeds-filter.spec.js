const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
chai.use(require('sinon-chai'));

const SeedsFilter = require('./seeds-filter');

describe('SeedsFilter', () => {
	let filter;
	let item;
	let torrent;
	let logger;

	beforeEach(() => {
		logger = {
			debug: sinon.stub()
		};
		item = {
		};
		torrent = {
		};
		filter = new SeedsFilter(logger);
	});

	describe('filter', () => {
		it('logs debug with result of filtering', () => {
			return filter.filter(item, [torrent]).then(result => {
				expect(logger.debug).to.have.been.calledWith(filter, 'Filtering result for torrents found for item', item, 'is', result);
			});
		});

		describe('with 0 seeds', () => {
			it('filters the torrent out', () => {
				item.seeders = 0;
				return filter.filter(item, [torrent]).then(result => expect(result).to.deep.equal([]));
			});
		});

		describe('with more than 0 seeds', () => {
			it('does not filter the torrent out', () => {
				torrent.seeders = 123;
				return filter.filter(item, [torrent]).then(result => expect(result).to.deep.equal([torrent]));
			});
		});
	});

	describe('toString', () => {
		it('returns meaningful info', () => {
			expect(filter.toString()).to.equal('Seeds Filter');
		});
	});
});
