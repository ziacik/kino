class TorrentSearchService {
	constructor(logger, ...engines) {
		this.logger = logger;
		this.engines = engines;
	}

	search(item) {
		let promises = this.engines.map(engine => this._searchWith(engine, item));
		return Promise.all(promises).then(results => this._processResults(results));
	}

	_searchWith(engine, item) {
		return engine.search(item).catch(e => e);
	}

	_processResults(torrentsOrErrors) {
		let errors = torrentsOrErrors.filter(it => !Array.isArray(it));
		let torrentLists = torrentsOrErrors.filter(it => Array.isArray(it));
		let result = {};
		if (!errors.length) {
			result.state = 'success';
		} else if (torrentLists.length) {
			result.state = 'partial';
		} else {
			result.state = 'fail';
		}
		result.torrents = [].concat.apply([], torrentLists);
		errors.forEach(err => this.logger.error(err));
		return result;
	}
}

module.exports = TorrentSearchService;
module.exports['@singleton'] = true;
module.exports['@require'] = ['../logger'];
