const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
chai.use(require('sinon-chai'));

const SeedsScorer = require('./seeds-scorer');

describe('SeedsScorer', () => {
	let scorer;
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
		scorer = new SeedsScorer(logger);
	});

	describe('#score', () => {
		it('logs debug with result of scoring', () => {
			return scorer.score(item, torrent).then(result => {
				expect(logger.debug).to.have.been.calledWith(scorer, 'Scoring result for torrent', torrent, 'for', item, 'is', result);
			});
		});

		describe('with 0 seeds', () => {
			it('resolves with 0', () => {
				item.seeders = 0;
				return scorer.score(item, torrent).then(result => expect(result).to.equal(0));
			});
		});

		describe('with more than 0 seeds', () => {
			it('resolves with 1', () => {
				torrent.seeders = 123;
				return scorer.score(item, torrent).then(result => expect(result).to.equal(1));
			});
		});
	});

	describe('toString', () => {
		it('returns meaningful info', () => {
			expect(scorer.toString()).to.equal('Seeds Scorer');
		});
	});
});
