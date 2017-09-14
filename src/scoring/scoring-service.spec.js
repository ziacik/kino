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

	beforeEach(() => {
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
		service = new ScoringService(scorer1, scorer2);
	});

	describe('#score', () => {
		it('resolves with all scorer results multiplied', () => {
			return service.score(item, torrent).then(result => {
				expect(scorer1.score).to.have.been.calledWith(item, torrent);
				expect(scorer2.score).to.have.been.calledWith(item, torrent);
				expect(result).to.equal(0.7);
			});
		});
	});
});
