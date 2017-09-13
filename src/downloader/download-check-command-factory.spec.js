const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const DownloadCheckCommand = require('./download-check-command');
const DownloadCheckCommandFactory = require('./download-check-command-factory');

describe('DownloadCheckCommandFactory', () => {
	let factory;
	let item;
	let downloadService;

	beforeEach(() => {
		downloadService = {};
		item = {};
		factory = new DownloadCheckCommandFactory(downloadService);
	});

	describe('#create', () => {
		it('creates a properly initialized command', () => {
			let command = factory.create(item, 'torrent-id');
			expect(command).to.be.an.instanceof(DownloadCheckCommand);
			expect(command.downloadService).to.equal(downloadService);
			expect(command.downloadCheckCommandFactory).to.equal(factory);
			expect(command.item).to.equal(item);
			expect(command.torrentId).to.equal('torrent-id');
			expect(command.delay).to.equal(10000);
		});
	});
});
