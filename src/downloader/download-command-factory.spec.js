const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const DownloadCommand = require('./download-command');
const DownloadCommandFactory = require('./download-command-factory');

describe('DownloadCommandFactory', () => {
	let factory;
	let item;
	let torrent;
	let downloadService;
	let downloadCheckCommandFactory;

	beforeEach(() => {
		item = {
			_id: 'item-id',
			some: 'item'
		};
		torrent = {
			magnetLink: 'magnet:link'
		};
		downloadService = {};
		downloadCheckCommandFactory = {};
		factory = new DownloadCommandFactory(downloadService, downloadCheckCommandFactory);
	});

	describe('#create', () => {
		it('creates a properly initialized command', () => {
			let command = factory.create(item, torrent);
			expect(command).to.be.an.instanceof(DownloadCommand);
			expect(command.downloadService).to.equal(downloadService);
			expect(command.downloadCheckCommandFactory).to.equal(downloadCheckCommandFactory);
			expect(command.item).to.equal(item);
			expect(command.torrent).to.equal(torrent);
		});
	});
});
