class SeasonScorer {
	constructor(logger) {
		this.logger = logger;
	}

	score(item, torrent) {
		return this._doScore(item, torrent).then(result => {
			this.logger.debug(this, 'Scoring result for torrent', torrent, 'for', item, 'is', result);
			return result;
		});
	}

	toString() {
		return 'Season Scorer';
	}

	_doScore(item, torrent) {
		if (item.type !== 'season') {
			return Promise.resolve(1);
		}

		let allowedPattern = new RegExp(`\\bS(eason)?\\s*0?${item.no}\\b`, 'i');
		if (!allowedPattern.test(torrent.name)) {
			return Promise.resolve(0);
		}

		let disallowedPattern = new RegExp(`\\b(Episode|Ep[.]?)\\s*[0-9]*\\b`, 'i');
		if (disallowedPattern.test(torrent.name)) {
			return Promise.resolve(0);
		}

		return Promise.resolve(1);
	}
}

module.exports = SeasonScorer;
module.exports['@singleton'] = true;
module.exports['@require'] = ['../../logger'];
