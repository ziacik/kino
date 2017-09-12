class TorrentSearchCommand {
	constructor(item, torrentSearchService) {
		this.item = item;
		this.torrentSearchService = torrentSearchService;
	}

	execute() {
		return this.torrentSearchService.search(this.item).then(result => {
			return result.torrents[0];
		});
	}
}

module.exports = TorrentSearchCommand;
