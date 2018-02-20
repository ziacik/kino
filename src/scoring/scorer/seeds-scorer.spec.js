const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
chai.use(require('sinon-chai'));

const SeedsScorer = require('./seeds-scorer');

describe('SeedsScorer', () => {
	let scorer;
	let item;
	let torrent1;
	let torrent2;
	let torrent3;
	let torrents;
	let logger;

	beforeEach(() => {
		logger = {
			debug: sinon.stub()
		};
		item = {};
		torrent1 = { seeders: 4 };
		torrent2 = { seeders: 6 };
		torrent3 = { seeders: 2 };
		torrents = [torrent1, torrent2, torrent3];
		scorer = new SeedsScorer(logger);
	});

	describe('score', () => {
		it('logs debug with result of scoring', () => {
			return scorer.score(item, torrents).then(result => {
				expect(logger.debug).to.have.been.calledWith(scorer, 'Scoring result for torrents', torrents, 'found for', item, 'is', result);
			});
		});

		it('sorts the torrents be seeders, desc', () => {
			return scorer.score(item, torrents).then(result => {
				expect(result).to.deep.equal([torrent2, torrent1, torrent3]);
			});
		});

		it('does not modify input list of torrents', () => {
			return scorer.score(item, torrents).then(result => {
				expect(result).not.to.equal(torrents);
			});
		});
	});

	describe('toString', () => {
		it('returns meaningful info', () => {
			expect(scorer.toString()).to.equal('Seeds Scorer');
		});
	});
});
