const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const ScoringService = require('./scoring-service');

describe('ScoringService', () => {
	let service;
	let item;
	let torrent;
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
		torrent = {
			some: 'torrent'
		};
		scorer1 = {
			score: sinon.stub().resolves(0.5)
		};
		scorer2 = {
			score: sinon.stub().resolves(1.4)
		};
		service = new ScoringService(logger, scorer1, scorer2);
	});

	describe('#score', () => {
		it('resolves with all scorer results multiplied', () => {
			return service.score(item, torrent).then(result => {
				expect(scorer1.score).to.have.been.calledWith(item, torrent);
				expect(scorer2.score).to.have.been.calledWith(item, torrent);
				expect(result).to.equal(0.7);
			});
		});

		it('logs debug result', () => {
			return service.score(item, torrent).then(result => {
				expect(logger.debug).to.have.been.calledWith(service, 'Scoring result for torrent', torrent, 'for', item, 'is', result);
			});
		});

		it('logs warning if some scorer fails and continues with other scorers', () => {
			let error = new Error('some error');
			scorer1.score.rejects(error);
			return service.score(item, torrent).then(result => {
				expect(result).to.equal(1.4);
				expect(logger.warn).to.have.been.calledWith(service, 'Scorer', scorer1, 'failed with', error);
			});
		});
	});
});
