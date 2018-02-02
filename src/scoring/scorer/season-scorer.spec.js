const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
chai.use(require('sinon-chai'));

const SeasonScorer = require('./season-scorer');

describe('SeasonScorer', () => {
	let scorer;
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
		scorer = new SeasonScorer(logger);
	});

	describe('#score', () => {
		it('logs debug with result of scoring', () => {
			item.type = 'movie';
			torrent.name = 'Whatever Season 1';
			return scorer.score(item, torrent).then(result => {
				expect(logger.debug).to.have.been.calledWith(scorer, 'Scoring result for torrent', torrent, 'for', item, 'is', result);
			});
		});

		describe('with item type other than "season"', () => {
			it('resolves with 1', () => {
				item.type = 'movie';
				torrent.name = 'Whatever S01E01';
				return scorer.score(item, torrent).then(result => expect(result).to.equal(1));
			});
		});

		describe('with "Season 1" item', () => {
			it('resolves with 0 if torrent name contains Season 2', () => {
				torrent.name = 'Whatever Season 2';
				return scorer.score(item, torrent).then(result => expect(result).to.equal(0));
			});

			it('resolves with 0 if torrent name contains Season 11', () => {
				torrent.name = 'Whatever Season 11';
				return scorer.score(item, torrent).then(result => expect(result).to.equal(0));
			});

			it('resolves with 0 if torrent name contains S02', () => {
				torrent.name = 'Whatever S02';
				return scorer.score(item, torrent).then(result => expect(result).to.equal(0));
			});

			it('resolves with 0 if torrent name contains S11', () => {
				torrent.name = 'Whatever S11';
				return scorer.score(item, torrent).then(result => expect(result).to.equal(0));
			});

			it('resolves with 0 if torrent name contains "Episode 1"', () => {
				torrent.name = 'Whatever Season 1 Episode 1';
				return scorer.score(item, torrent).then(result => expect(result).to.equal(0));
			});

			it('resolves with 0 if torrent name contains "Ep. 1"', () => {
				torrent.name = 'Whatever Season 1 Ep. 1';
				return scorer.score(item, torrent).then(result => expect(result).to.equal(0));
			});

			it('resolves with 0 if torrent name contains "S01E01"', () => {
				torrent.name = 'Whatever S01E01';
				return scorer.score(item, torrent).then(result => expect(result).to.equal(0));
			});

			it('resolves with 1 if torrent name contains Season 1', () => {
				torrent.name = 'Whatever Season 1';
				return scorer.score(item, torrent).then(result => expect(result).to.equal(1));
			});

			it('resolves with 1 if torrent name contains Season 01', () => {
				torrent.name = 'Whatever Season 01';
				return scorer.score(item, torrent).then(result => expect(result).to.equal(1));
			});

			it('resolves with 1 if torrent name contains S01', () => {
				torrent.name = 'Whatever S01';
				return scorer.score(item, torrent).then(result => expect(result).to.equal(1));
			});
		});
	});

	describe('toString', () => {
		it('returns meaningful info', () => {
			expect(scorer.toString()).to.equal('Season Scorer');
		});
	});
});
