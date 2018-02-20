class SeasonFilter {
	constructor(logger) {
		this.logger = logger;
	}

	async filter(item, torrents) {
		const filteredTorrents = await this._doScore(item, torrents);
		this.logger.debug(this, 'Filtering result for torrents found for item', item, 'is', filteredTorrents);
		return filteredTorrents;
	}

	toString() {
		return 'Season Filter';
	}

	async _doScore(item, torrents) {
		if (item.type !== 'season') {
			return torrents;
		}

		const allowedPattern = new RegExp(`\\bS(eason)?\\s*0?${item.no}\\b`, 'i');

		return torrents.filter(torrent => {
			if (!allowedPattern.test(torrent.name)) {
				return false;
			}

			let disallowedPattern = new RegExp(`\\b(Episode|Ep[.]?)\\s*[0-9]*\\b`, 'i');
			if (disallowedPattern.test(torrent.name)) {
				return false;
			}

			return true;
		});
	}
}

module.exports = SeasonFilter;
module.exports['@singleton'] = true;
module.exports['@require'] = ['../../logger'];
