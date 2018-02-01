const Torrent = require('../torrent');

const ID_PARSE_REGEX = /\/torrent\/([^/]+)/;

class TpbEngine {
	constructor(logger, lib) {
		this.logger = logger;
		this.lib = lib;

		this.categoryMap = {
			movie: {
				'Movies': 'sd',
				'HD - Movies': 'hd',
				'Movies DVDR': 'sd'
			},
			season: {
				'TV shows': 'sd',
				'HD - TV shows': 'hd'
			},
			album: {
				'Music': 'sd',
				'FLAC': 'hd'
			}
		};
	}

	async search(item) {
		try {
			const category = item.type === 'album' ? 'Audio' : 'Video';
			const searchTerm = this._constructSerchTerm(item);
			const results = await this.lib.search(searchTerm, category);
			const resultsFiltered = this._filterResults(item, results);
			this.logger.info(this, resultsFiltered.length, 'torrents found for', item);
			return resultsFiltered.map(one => this._toTorrent(item, one));
		} catch (e) {
			this.logger.error(this, 'Search for torrents for', item, 'failed with', e);
			throw e;
		}
	}

	toString() {
		return 'TPB Engine';
	}

	_constructSerchTerm(item) {
		if (item.type === 'movie') {
			return item.name;
		}

		if (item.type === 'season') {
			return `${item.parent.name} season ${item.no}`;
		}

		if (item.type === 'album') {
			return `${item.parent.name} ${item.name}`;
		}
	}

	_filterResults(item, results) {
		return results.filter(result => {
			return result && this.categoryMap[item.type][result.subcategory];
		});
	}

	_toTorrent(item, result) {
		return new Torrent({
			id: this._parseId(result),
			name: result.title,
			size: this._parseSize(result),
			pageLink: result.desc,
			type: item.type,
			quality: this._parseQuality(item, result),
			seeders: +result.seeds,
			leechers: +result.peers,
			magnetLink: result.magnet,
			verified: !!result.verified
		});
	}

	_parseId(result) {
		return ID_PARSE_REGEX.exec(result.desc)[1];
	}

	_parseSize(result) {
		let sizeStr = result.size;
		let sizeSplit = sizeStr.split(/\s/);
		let size = +sizeSplit[0];
		let unit = sizeSplit[1];
		switch (unit) {
		case 'KiB':
			size = size / 1000;
			break;
		case 'MiB':
			break;
		case 'GiB':
			break;
		default:
			throw new Error('Unable to parse size ${sizeStr}.');
		}
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

	_parseQuality(item, result) {
		let quality = this.categoryMap[item.type][result.subcategory];

		if (quality === 'sd') {
			if (item.type === 'album') {
				if (/\bFLAC\b/.test(result.title)) {
					quality = 'hd';
				}
			} else {
				if (/\b(1080|720)p\b/.test(result.title)) {
					quality = 'hd';
				}
			}
		}

		return quality;

	}
}

module.exports = TpbEngine;
module.exports['@singleton'] = true;
module.exports['@require'] = ['../../logger', './tsa-thepiratebay'];
