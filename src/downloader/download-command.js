class DownloadCommand {
	constructor(item, torrent, downloadService, downloadCheckCommandFactory) {
		this.item = item;
		this.torrent = torrent;
		this.downloadService = downloadService;
		this.downloadCheckCommandFactory = downloadCheckCommandFactory;
	}

	execute() {
		return this.downloadService.download(this.torrent).then(torrentId => this.downloadCheckCommandFactory.create(this.item, torrentId));
	}

	toString() {
		return `Download ${this.item}`;
	}
}

module.exports = DownloadCommand;
