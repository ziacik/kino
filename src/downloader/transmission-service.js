const { promisify } = require('util');

class TransmissionService {
	constructor(logger, clientFactory) {
		this.logger = logger;
		this.client = new clientFactory();
		this.addUrl = promisify(this.client.addUrl).bind(this.client);
		this.get = promisify(this.client.get).bind(this.client);
	}

	async download(torrent) {
		try {
			const result = await this.addUrl(torrent.magnetLink);
			this.logger.info(this, 'Torrent', torrent, 'has been added');
			return result.id;
		} catch(e) {
			this.logger.error(this, 'Adding a torrent', torrent, 'failed with', e);
			throw e;
		}
	}

	async getState(torrentId) {
		try {
			const result = await this.get([torrentId]);

			console.log(result);

			if (!result || !result.torrents || !result.torrents.length) {
				console.log('removed');
				return 'removed';
			}

			const state = result.torrents[0].status;

			console.log('STATE', state);

			if ( state === this.client.status.STOPPED) {
				return 'finished';
			}

			if (state === this.client.status.ISOLATED) {
				return 'stalled';
			}

			return 'downloading';
		} catch(e) {
			this.logger.error(this, 'Requesting state of the torrent', torrentId, 'failed with', e);
			throw e;
		}
	}
}

module.exports = TransmissionService;
module.exports['@singleton'] = true;
module.exports['@require'] = ['../logger', 'transmission'];
