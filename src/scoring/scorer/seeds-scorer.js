class SeedsScorer {
	constructor(logger) {
		this.logger = logger;
	}

	async score(item, torrents) {
		const result = torrents.slice().sort((a, b) => b.seeders - a.seeders);
		this.logger.debug(this, 'Scoring result for torrents', torrents, 'found for', item, 'is', result);
		return result;
	}

	toString() {
		return 'Seeds Scorer';
	}
}

module.exports = SeedsScorer;
module.exports['@singleton'] = true;
module.exports['@require'] = ['../../logger'];
