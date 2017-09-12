const DownloadCheckCommand = require('./download-check-command');

class DownloadCheckCommandFactory {
	constructor(downloadService) {
		this.downloadService = downloadService;
	}

	create(forItem, torrentId) {
		return new DownloadCheckCommand(forItem, torrentId, this.downloadService, this);
	}
}

module.exports = DownloadCheckCommandFactory;
module.exports['@singleton'] = true;
module.exports['@require'] = ['./transmission-service'];
