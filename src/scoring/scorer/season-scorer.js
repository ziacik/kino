class SeasonScorer {
	constructor() {
	}

	score(item, torrent) {
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
module.exports['require'] = [];
