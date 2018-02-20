class SeedsFilter {
	constructor(logger) {
		this.logger = logger;
	}

	async filter(item, torrents) {
		const result = await this._doScore(torrents);
		this.logger.debug(this, 'Filtering result for torrents found for item', item, 'is', result);
		return result;
	}

	toString() {
		return 'Seeds Filter';
	}

	async _doScore(torrents) {
		return torrents.filter(torrent => !!torrent.seeders);
	}
}

module.exports = SeedsFilter;
module.exports['@singleton'] = true;
module.exports['@require'] = ['../../logger'];
