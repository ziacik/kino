class SeedsScorer {
	constructor(logger) {
		this.logger = logger;
	}

	async score(item, torrent) {
		const result = await this._doScore(torrent);
		this.logger.debug(this, 'Scoring result for torrent', torrent, 'for', item, 'is', result);
		return result;
	}

	toString() {
		return 'Seeds Scorer';
	}

	async _doScore(torrent) {
		return torrent.seeders ? 1 : 0;
	}
}

module.exports = SeedsScorer;
module.exports['@singleton'] = true;
module.exports['@require'] = ['../../logger'];
