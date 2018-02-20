class ScoringService {
	constructor(logger, ...scorers) {
		this.logger = logger;
		this.scorers = scorers;
	}

	async score(item, torrents) {
		if (!torrents.length) {
			return;
		}

		const scoring = torrents.map(() => 0);

		for (const scorer of this.scorers) {
			const sortedTorrents = await this._scoreWith(item, torrents, scorer);

			if (!sortedTorrents) {
				continue;
			}

			torrents.forEach((torrent, i) => {
				const position = sortedTorrents.indexOf(torrent);
				const score = position >= 0 ? position : (torrents.length - 1);
				scoring[i] += score;
			});
		}

		let bestScore = scoring[0];
		let bestI = 0;

		for (let i = 1; i < scoring.length; i++) {
			const score = scoring[i];

			if (score < bestScore) {
				bestScore = score;
				bestI = i;
			}
		}

		const result = torrents[bestI];

		this.logger.debug(this, 'Scoring result for torrents', torrents, 'found for', item, 'is', result);
		return result;
	}

	async _scoreWith(item, torrents, scorer) {
		try {
			return await scorer.score(item, torrents);
		} catch(err) {
			this.logger.warn(this, 'Scorer', scorer, 'failed with', err);
		}
	}
}

module.exports = ScoringService;
module.exports['@singleton'] = true;
module.exports['@require'] = [
	'../logger',
	'./scorer/seeds-scorer'
];
