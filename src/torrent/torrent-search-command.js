class TorrentSearchCommand {
	constructor(item, logger, torrentSearchService, scoringService, torrentSearchCommandFactory, downloadCommandFactory) {
		this.item = item;
		this.logger = logger;
		this.torrentSearchService = torrentSearchService;
		this.scoringService = scoringService;
		this.torrentSearchCommandFactory = torrentSearchCommandFactory;
		this.downloadCommandFactory = downloadCommandFactory;
	}

	execute() {
		return this.torrentSearchService.search(this.item)
			.then(result => this._selectBestTorrent(result))
			.then(torrent => this._createNextCommand(torrent));
	}

	_createNextCommand(forTorrent) {
		this.logger.log('Done searching, have?', forTorrent);

		if (forTorrent) {
			return this.downloadCommandFactory.create(this.item, forTorrent);
		} else {
			let next = this.torrentSearchCommandFactory.create(this.item);
			next.delay = 24 * 60 * 60 * 1000;
			return next;
		}
	}

	_selectBestTorrent(searchResult) {
		this.logger.log('Gonna select best from', searchResult);

		let scorePromises = searchResult.torrents.map(torrent => {
			return this.scoringService.score(this.item, torrent).then(score => ({
				score: score,
				torrent: torrent
			}));
		});

		return Promise.all(scorePromises).then(scoredTorrents => this._getBestScored(scoredTorrents));
	}

	_getBestScored(scoredTorrents) {
		this.logger.log('Scored', scoredTorrents);
		let best = scoredTorrents.filter(it => it.score > 0).sort((one, two) => {
			return two.score - one.score;
		});
		this.logger.log('Best', best);
		return best[0] && best[0].torrent;
	}
}

module.exports = TorrentSearchCommand;
