const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const DownloadCommand = require('./download-command');

describe('DownloadCommand', () => {
	let command;
	let item;
	let torrent;
	let downloadService;

	beforeEach(() => {
		item = {
			_id: 'item-id',
			some: 'item'
		};
		torrent = {
			magnetLink: 'magnet:link'
		};
		downloadService = {
			download: sinon.stub().resolves(123)
		};
		command = new DownloadCommand(downloadService);
	});

	describe('#create', () => {
		it('creates a new command with the same data', () => {
			let another = command.create(item, torrent);
			expect(another).not.to.equal(command);
			expect(another.downloadService).to.equal(downloadService);
			expect(another.item).to.equal(item);
			expect(another.torrent).to.equal(torrent);
		});
	});

	describe('#execute', () => {
		it('adds a torrent to download service and returns id of the download', () => {
			command.item = item;
			command.torrent = torrent;
			return command.execute().then(result => {
				expect(downloadService.download).to.have.been.calledWith(torrent);
				expect(result).to.equal(123);
			});
		});
	});
});
