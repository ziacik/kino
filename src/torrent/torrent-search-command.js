class TorrentSearchCommand {
	constructor(item, torrentSearchService) {
		this.item = item;
		this.torrentSearchService = torrentSearchService;
	}

	execute() {
		return this.torrentSearchService.search(this.item);
	}
}

module.exports = TorrentSearchCommand;
