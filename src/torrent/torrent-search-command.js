class TorrentSearchCommand {
	constructor(item, itemStateUpdater, torrentSearchService, filteringService, scoringService, torrentSearchCommandFactory, downloadCommandFactory) {
		this.maxRetryCount = 3;
		this.item = item;
		this.itemStateUpdater = itemStateUpdater;
		this.torrentSearchService = torrentSearchService;
		this.filteringService = filteringService;
		this.scoringService = scoringService;
		this.torrentSearchCommandFactory = torrentSearchCommandFactory;
		this.downloadCommandFactory = downloadCommandFactory;
	}

	async execute() {
		await this.itemStateUpdater.update(this.item, 'searching');

		try {
			const searchResult = await this.torrentSearchService.search(this.item);
			const filteredTorrents = await this.filteringService.filter(this.item, searchResult.torrents);
			const bestTorrent = await this.scoringService.score(this.item, filteredTorrents);
			return this._createNextCommand(bestTorrent);
		} catch(e) {
			await this.itemStateUpdater.update(this.item, 'error');
			throw e;
		}
	}

	toString() {
		return `Search for a torrent for ${this.item}`;
	}

	_createNextCommand(forTorrent) {
		if (forTorrent) {
			return this.itemStateUpdater.update(this.item, 'found').then(() =>
				this.downloadCommandFactory.create(this.item, forTorrent)
			);
		} else {
			return this.itemStateUpdater.update(this.item, 'not-found').then(() => {
				let next = this.torrentSearchCommandFactory.create(this.item);
				next.delay = 24 * 60 * 60 * 1000;
				return next;
			});
		}
	}
}

module.exports = TorrentSearchCommand;
