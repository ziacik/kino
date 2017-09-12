const TorrentSearchCommand = require('./torrent-search-command');

class TorrentSearchCommandFactory {
	constructor(torrentSearchService) {
		this.torrentSearchService = torrentSearchService;
	}

	create(item) {
		return new TorrentSearchCommand(item, this.torrentSearchService);
	}
}

module.exports = TorrentSearchCommandFactory;
module.exports['@singleton'] = true;
module.exports['@require'] = ['./torrent-search-service'];
