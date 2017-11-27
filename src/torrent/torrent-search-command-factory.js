const TorrentSearchCommand = require('./torrent-search-command');

class TorrentSearchCommandFactory {
	constructor(logger, torrentSearchService, scoringService, downloadCommandFactory) {
		this.logger = logger;
		this.torrentSearchService = torrentSearchService;
		this.scoringService = scoringService;
		this.downloadCommandFactory = downloadCommandFactory;
	}

	create(item) {
		return new TorrentSearchCommand(item, this.logger, this.torrentSearchService, this.scoringService, this, this.downloadCommandFactory);
	}
}

module.exports = TorrentSearchCommandFactory;
module.exports['@singleton'] = true;
module.exports['@require'] = ['../logger', './torrent-search-service', '../scoring/scoring-service', '../downloader/download-command-factory'];
