class DownloadCheckCommand {
	constructor(downloadService) {
		this.downloadService = downloadService;
	}

	create(forItem, itemState) {
		let another = new DownloadCheckCommand(this.downloadService);
		another.item = forItem;
		another.itemState = itemState;
		another.delay = 10000;
		return another;
	}

	execute() {
		return this.downloadService.getState(this.itemState).then(r => {
			console.log(r);
			return r;
		});
	}
}

module.exports = DownloadCheckCommand;
module.exports['@singleton'] = true;
module.exports['@require'] = ['./transmission-service'];
