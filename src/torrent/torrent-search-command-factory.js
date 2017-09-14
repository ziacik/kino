const TorrentSearchCommand = require('./torrent-search-command');

class TorrentSearchCommandFactory {
	constructor(torrentSearchService, scoringService, downloadCommandFactory) {
		this.torrentSearchService = torrentSearchService;
		this.scoringService = scoringService;
		this.downloadCommandFactory = downloadCommandFactory;
	}

	create(item) {
		return new TorrentSearchCommand(item, this.torrentSearchService, this.scoringService, this, this.downloadCommandFactory);
	}
}

module.exports = TorrentSearchCommandFactory;
module.exports['@singleton'] = true;
module.exports['@require'] = ['./torrent-search-service', '../scoring/scoring-service', '../downloader/download-command-factory'];
