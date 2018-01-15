const TorrentSearchCommand = require('./torrent-search-command');

class TorrentSearchCommandFactory {
	constructor(itemStateUpdater, torrentSearchService, scoringService, downloadCommandFactory) {
		this.itemStateUpdater = itemStateUpdater;
		this.torrentSearchService = torrentSearchService;
		this.scoringService = scoringService;
		this.downloadCommandFactory = downloadCommandFactory;
	}

	create(item) {
		return new TorrentSearchCommand(item, this.itemStateUpdater, this.torrentSearchService, this.scoringService, this, this.downloadCommandFactory);
	}
}

module.exports = TorrentSearchCommandFactory;
module.exports['@singleton'] = true;
module.exports['@require'] = ['../item/item-state-updater', './torrent-search-service', '../scoring/scoring-service', '../downloader/download-command-factory'];
