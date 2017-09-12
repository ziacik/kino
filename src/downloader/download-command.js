class DownloadCommand {
	constructor(downloadService) {
		this.downloadService = downloadService;
	}

	create(forItem, torrent) {
		let another = new DownloadCommand(this.downloadService);
		another.item = forItem;
		another.torrent = torrent;
		return another;
	}

	execute() {
		return this.downloadService.download(this.torrent).then(torrentId => ({
			torrentId: torrentId
		}));
	}
}

module.exports = DownloadCommand;
module.exports['@singleton'] = true;
module.exports['@require'] = ['./transmission-service'];
