class ScoringService {
	constructor(...scorers) {
		this.scorers = scorers;
	}

	score(item, torrent) {
		let scorerPromises = this.scorers.map(scorer => scorer.score(item, torrent));
		return Promise.all(scorerPromises).then(results => results.reduce((sum, result) => sum * result, 1));
	}
}

module.exports = ScoringService;
module.exports['@singleton'] = true;
module.exports['@require'] = ['./scorer/season-scorer'];
