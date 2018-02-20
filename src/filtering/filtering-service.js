class FilteringService {
	constructor(logger, ...filters) {
		this.logger = logger;
		this.filters = filters;
	}

	async filter(item, torrents) {
		let filteredTorrents = torrents;

		for (const filter of this.filters) {
			filteredTorrents = await this._filterWith(item, filteredTorrents, filter);
		}

		this.logger.debug(this, 'Filtering result for torrents found for item', item, 'is', filteredTorrents);

		return filteredTorrents;
	}

	async _filterWith(item, torrents, filter) {
		try {
			return await filter.filter(item, torrents);
		} catch (err) {
			this.logger.warn(this, 'Filter', filter, 'failed with', err);
			return torrents;
		}
	}
}

module.exports = FilteringService;
module.exports['@singleton'] = true;
module.exports['@require'] = [
	'../logger',
	'./filter/season-filter',
	'./filter/seeds-filter'
];
