class TransmissionService {
	constructor(logger, clientFactory) {
		this.logger = logger;
		this.client = new clientFactory({
			url: 'http://localhost:9091/transmission/rpc'
		});
	}

	download(torrent) {
		return this.client.torrentAdd({
			filename: torrent.magnetLink
		}).catch(err => {
			this.logger.error(err);
			throw err;
		});
	}

	getState(torrentId) {
		return this.client.torrentGet({
			ids: [torrentId],
			fields: ['id', 'isFinished', 'isStalled']
		}).then(result => {
			let torrentInfo = result.arguments.torrents.filter(it => it.id === torrentId)[0];

			if (!torrentInfo) {
				return 'removed';
			}

			if (torrentInfo.isFinished) {
				return 'finished';
			}

			if (torrentInfo.isStalled) {
				return 'stalled';
			}

			return 'downloading';
		}).catch(err => {
			this.logger.error(err);
			throw err;
		});
	}
}

module.exports = TransmissionService;
module.exports['@singleton'] = true;
module.exports['@require'] = ['../logger', 'powersteer'];
