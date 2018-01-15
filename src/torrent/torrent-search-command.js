class TorrentSearchCommand {
	constructor(item, itemStateUpdater, torrentSearchService, scoringService, torrentSearchCommandFactory, downloadCommandFactory) {
		this.item = item;
		this.itemStateUpdater = itemStateUpdater;
		this.torrentSearchService = torrentSearchService;
		this.scoringService = scoringService;
		this.torrentSearchCommandFactory = torrentSearchCommandFactory;
		this.downloadCommandFactory = downloadCommandFactory;
	}

	execute() {
		return this.itemStateUpdater.update(this.item, 'searching')
			.then(() => this.torrentSearchService.search(this.item))
			.then(result => this._selectBestTorrent(result))
			.then(torrent => this._createNextCommand(torrent));
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

	_selectBestTorrent(searchResult) {
		let scorePromises = searchResult.torrents.map(torrent => {
			return this.scoringService.score(this.item, torrent).then(score => ({
				score: score,
				torrent: torrent
			}));
		});

		return Promise.all(scorePromises).then(scoredTorrents => this._getBestScored(scoredTorrents));
	}

	_getBestScored(scoredTorrents) {
		let best = scoredTorrents.filter(it => it.score > 0).sort((one, two) => {
			return two.score - one.score;
		});
		return best[0] && best[0].torrent;
	}
}

module.exports = TorrentSearchCommand;
