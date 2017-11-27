const Torrent = require('../torrent');

class TpbEngine {
	constructor(logger, lib) {
		this.logger = logger;
		this.lib = lib;
		this.logger.register(this);
	}

	search(item) {
		return this.lib.search(item.name).catch(e => {
			this.logger.error(e);
			throw e;
		}).then(results => {
			return results.map(one => this._toTorrent(one));
		});
	}

	_toTorrent(result) {
		return new Torrent({
			id: result.id,
			name: result.name,
			size: this._parseSize(result),
			pageLink: result.link,
			type: this._parseType(result),
			quality: this._parseQuality(result),
			seeders: +result.seeders,
			leechers: +result.leechers,
			magnetLink: result.magnetLink,
			verified: !!result.verified
		});
	}

	_parseSize(result) {
		let sizeStr = result.size;
		let sizeSplit = sizeStr.split(/\s/);
		let size = +sizeSplit[0];
		let unit = sizeSplit[1];
		// TODO: account for unit. now assuming MiB
		return size;
	}

	_parseType(result) {
		// TODO account for other categories
		if (result.subcategory.id === '205') {
			return 'show';
		} else {
			return 'movie';
		}
	}

	_parseQuality(result) {
		// TODO
		return 'sd';
	}
}

module.exports = TpbEngine;
module.exports['@singleton'] = true;
module.exports['@require'] = ['../../logger', 'thepiratebay'];
