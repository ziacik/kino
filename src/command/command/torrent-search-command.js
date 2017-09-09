class TorrentSearchCommand {
	constructor(torrentSearchService) {
		this.torrentSearchService = torrentSearchService;
	}

	cloneForItem(item) {
		let clone = new TorrentSearchCommand(this.torrentSearchService);
		clone.item = item;
		return clone;
	}

	execute() {
		return this.torrentSearchService.search(this.item);
	}
}

module.exports = TorrentSearchCommand;
module.exports['@require'] = ['../../torrent/torrent-search-service'];
