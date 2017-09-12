const DownloadCommand = require('./download-command');

class DownloadCommandFactory {
	constructor(downloadService, downloadCheckCommandFactory) {
		this.downloadService = downloadService;
		this.downloadCheckCommandFactory = downloadCheckCommandFactory;
	}

	create(forItem, torrent) {
		return new DownloadCommand(forItem, torrent, this.downloadService, this.downloadCheckCommandFactory);
	}
}

module.exports = DownloadCommandFactory;
module.exports['@singleton'] = true;
module.exports['@require'] = ['./transmission-service', './download-check-command-factory'];
