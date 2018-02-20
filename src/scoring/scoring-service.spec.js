const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const ScoringService = require('./scoring-service');

describe('ScoringService', () => {
	let service;
	let item;
	let torrent1;
	let torrent2;
	let torrent3;
	let torrents;
	let scoringResult1;
	let scoringResult2;
	let scorer1;
	let scorer2;
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
		scoringResult1 = [torrent3, torrent2, torrent1];
		scoringResult2 = [torrent2, torrent1];
		scorer1 = {
			score: sinon.stub().resolves(scoringResult1)
		};
		scorer2 = {
			score: sinon.stub().resolves(scoringResult2)
		};
		service = new ScoringService(logger, scorer1, scorer2);
	});

	describe('score', () => {
		it('returns undefined if the list of torrents is empty', () => {
			return service.score(item, []).then(result => {
				expect(result).to.be.undefined;
				expect(scorer1.score).not.to.have.been.called;
				expect(scorer2.score).not.to.have.been.called;
			});
		});

		it('calls each scorer', () => {
			return service.score(item, torrents).then(() => {
				expect(scorer1.score).to.have.been.calledWith(item, torrents);
				expect(scorer2.score).to.have.been.calledWith(item, torrents);
			});
		});

		it('calculates the average score of each torrent and returns the best', () => {
			return service.score(item, torrents).then(result => {
				expect(result).to.equal(torrent2);
			});
		});

		it('logs debug result', () => {
			return service.score(item, torrents).then(result => {
				expect(logger.debug).to.have.been.calledWith(service, 'Scoring result for torrents', torrents, 'found for', item, 'is', result);
			});
		});

		it('logs warning if some scorer fails and continues with other scorers', () => {
			let error = new Error('some error');
			scorer2.score.rejects(error);
			return service.score(item, torrents).then(result => {
				expect(logger.warn).to.have.been.calledWith(service, 'Scorer', scorer2, 'failed with', error);
				expect(result).to.equal(torrent3);
			});
		});
	});
});
