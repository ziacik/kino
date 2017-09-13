class DownloadCheckCommand {
	constructor(item, torrentId, downloadService, downloadCheckCommandFactory) {
		this.item = item;
		this.torrentId = torrentId;
		this.downloadService = downloadService;
		this.downloadCheckCommandFactory = downloadCheckCommandFactory;
		this.delay = 10000;
	}

	execute() {
		return this.downloadService.getState(this.torrentId).then(state => this._createNextCommand(state));
	}

	_createNextCommand(forState) {
		switch (forState) {
		case 'downloading':
		case 'stalled':
			return this.downloadCheckCommandFactory.create(this.item, this.torrentId);
		}
	}
}

module.exports = DownloadCheckCommand;
