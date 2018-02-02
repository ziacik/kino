class ScoringService {
	constructor(logger, ...scorers) {
		this.logger = logger;
		this.scorers = scorers;
	}

	score(item, torrent) {
		let scorerPromises = this.scorers.map(scorer => this._scoreWith(item, torrent, scorer));
		return Promise.all(scorerPromises)
			.then(results => results.reduce((sum, result) => sum * result, 1))
			.then(result => {
				this.logger.debug(this, 'Scoring result for torrent', torrent, 'for', item, 'is', result);
				return result;
			});
	}

	_scoreWith(item, torrent, scorer) {
		return scorer.score(item, torrent).catch(err => {
			this.logger.warn(this, 'Scorer', scorer, 'failed with', err);
			return 1;
		});
	}
}

module.exports = ScoringService;
module.exports['@singleton'] = true;
module.exports['@require'] = [
	'../logger',
	'./scorer/season-scorer',
	'./scorer/seeds-scorer'
];
