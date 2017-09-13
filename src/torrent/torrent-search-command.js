class TorrentSearchCommand {
	constructor(item, torrentSearchService, downloadCommandFactory) {
		this.item = item;
		this.torrentSearchService = torrentSearchService;
		this.downloadCommandFactory = downloadCommandFactory;
	}

	execute() {
		return this.torrentSearchService.search(this.item).then(result => this.downloadCommandFactory.create(this.item, result.torrents[0]));
	}
}

module.exports = TorrentSearchCommand;
