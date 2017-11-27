class SeasonScorer {
	constructor(logger) {
		this.logger = logger;
		this.logger.register(this);
	}

	score(item, torrent) {
		item.no = item.no || 1;
		let allowedPattern = new RegExp(`\\bS(eason)?\\s*0?${item.no}\\b`, 'i');
		if (!allowedPattern.test(torrent.name)) {
			this.logger.log('Not allowed', torrent.name);
			return Promise.resolve(0);
		}

		let disallowedPattern = new RegExp(`\\b(Episode|Ep[.]?)\\s*[0-9]*\\b`, 'i');
		if (disallowedPattern.test(torrent.name)) {
			this.logger.log('Disallowed', torrent.name);
			return Promise.resolve(0);
		}

		return Promise.resolve(1);
	}
}

module.exports = SeasonScorer;
module.exports['@singleton'] = true;
module.exports['@require'] = ['../../logger'];
