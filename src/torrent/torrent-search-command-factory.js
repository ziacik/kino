const TorrentSearchCommand = require('./torrent-search-command');

class TorrentSearchCommandFactory {
	constructor(torrentSearchService, downloadCommandFactory) {
		this.torrentSearchService = torrentSearchService;
		this.downloadCommandFactory = downloadCommandFactory;
	}

	create(item) {
		return new TorrentSearchCommand(item, this.torrentSearchService, this.downloadCommandFactory);
	}
}

module.exports = TorrentSearchCommandFactory;
module.exports['@singleton'] = true;
module.exports['@require'] = ['./torrent-search-service', '../downloader/download-command-factory'];
