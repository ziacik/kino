const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
chai.use(require('sinon-chai'));

const SeasonFilter = require('./season-filter');

describe('SeasonFilter', () => {
	let filter;
	let item;
	let torrent;
	let logger;

	beforeEach(() => {
		logger = {
			debug: sinon.stub()
		};
		item = {
			type: 'season',
			no: 1,
			some: 'item'
		};
		torrent = {
			some: 'torrent',
			name: 'Whatever Season 1'
		};
		filter = new SeasonFilter(logger);
	});

	describe('filter', () => {
		it('logs debug with result of filtering', () => {
			item.type = 'movie';
			torrent.name = 'Whatever Season 1';
			return filter.filter(item, [torrent]).then(result => {
				expect(logger.debug).to.have.been.calledWith(filter, 'Filtering result for torrents found for item', item, 'is', result);
			});
		});

		describe('with item type other than "season"', () => {
			it('does not filter anything', () => {
				item.type = 'movie';
				torrent.name = 'Whatever S01E01';
				return filter.filter(item, [torrent]).then(result => expect(result).to.deep.equal([torrent]));
			});
		});

		describe('with "Season 1" item', () => {
			it('filters torrent out if name contains Season 2', () => {
				torrent.name = 'Whatever Season 2';
				return filter.filter(item, [torrent]).then(result => expect(result).to.deep.equal([]));
			});

			it('filters torrent out if torrent name contains Season 11', () => {
				torrent.name = 'Whatever Season 11';
				return filter.filter(item, [torrent]).then(result => expect(result).to.deep.equal([]));
			});

			it('filters torrent out if torrent name contains S02', () => {
				torrent.name = 'Whatever S02';
				return filter.filter(item, [torrent]).then(result => expect(result).to.deep.equal([]));
			});

			it('filters torrent out if torrent name contains S11', () => {
				torrent.name = 'Whatever S11';
				return filter.filter(item, [torrent]).then(result => expect(result).to.deep.equal([]));
			});

			it('filters torrent out if torrent name contains "Episode 1"', () => {
				torrent.name = 'Whatever Season 1 Episode 1';
				return filter.filter(item, [torrent]).then(result => expect(result).to.deep.equal([]));
			});

			it('filters torrent out if torrent name contains "Ep. 1"', () => {
				torrent.name = 'Whatever Season 1 Ep. 1';
				return filter.filter(item, [torrent]).then(result => expect(result).to.deep.equal([]));
			});

			it('filters torrent out if torrent name contains "S01E01"', () => {
				torrent.name = 'Whatever S01E01';
				return filter.filter(item, [torrent]).then(result => expect(result).to.deep.equal([]));
			});

			it('does not filter torrent out if torrent name contains Season 1', () => {
				torrent.name = 'Whatever Season 1';
				return filter.filter(item, [torrent]).then(result => expect(result).to.deep.equal([torrent]));
			});

			it('does not filter torrent out if torrent name contains Season 01', () => {
				torrent.name = 'Whatever Season 01';
				return filter.filter(item, [torrent]).then(result => expect(result).to.deep.equal([torrent]));
			});

			it('does not filter torrent out if torrent name contains S01', () => {
				torrent.name = 'Whatever S01';
				return filter.filter(item, [torrent]).then(result => expect(result).to.deep.equal([torrent]));
			});
		});
	});

	describe('toString', () => {
		it('returns meaningful info', () => {
			expect(filter.toString()).to.deep.equal('Season Filter');
		});
	});
});
