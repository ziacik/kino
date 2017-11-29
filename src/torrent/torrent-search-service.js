class TorrentSearchService {
	constructor(logger, ...engines) {
		this.logger = logger;
		this.engines = engines;
	}

	search(item) {
		let promises = this.engines.map(engine => this._searchWith(engine, item));
		return Promise.all(promises).then(results => this._processResults(item, results));
	}

	_searchWith(engine, item) {
		return engine.search(item).catch(() => engine);
	}

	_processResults(item, torrentsOrFailedEngines) {
		let failedEngines = torrentsOrFailedEngines.filter(it => !Array.isArray(it));
		let torrentLists = torrentsOrFailedEngines.filter(it => Array.isArray(it));
		let result = {};
		if (!failedEngines.length) {
			result.state = 'success';
		} else if (torrentLists.length) {
			result.state = 'partial';
		} else {
			result.state = 'fail';
		}
		result.torrents = [].concat.apply([], torrentLists);
		failedEngines.forEach(engine => this.logger.warn(this, 'Search engine', engine, 'failed when searching for', item));
		return result;
	}
}

module.exports = TorrentSearchService;
module.exports['@singleton'] = true;
module.exports['@require'] = ['../logger', './search-engine/tpb-engine'];
