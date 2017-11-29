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
	let downloadCheckCommandFactory;
	let downloadCheckCommand;

	beforeEach(() => {
		item = {
			_id: 'item-id',
			some: 'item',
			toString: () => 'an item'
		};
		torrent = {
			magnetLink: 'magnet:link'
		};
		downloadService = {
			download: sinon.stub().resolves('torrent-id')
		};
		downloadCheckCommand = {};
		downloadCheckCommandFactory = {
			create: sinon.stub().resolves(downloadCheckCommand)
		};
		command = new DownloadCommand(item, torrent, downloadService, downloadCheckCommandFactory);
	});

	describe('#execute', () => {
		it('adds a torrent to download service', () => {
			return command.execute().then(() => {
				expect(downloadService.download).to.have.been.calledWith(torrent);
			});
		});

		it('returns download check command initialized with id of the download', () => {
			return command.execute().then(result => {
				expect(downloadCheckCommandFactory.create).to.have.been.calledWith(item, 'torrent-id');
				expect(result).to.equal(downloadCheckCommand);
			});
		});
	});

	describe('toString', () => {
		it('returns meaningful command info', () => {
			expect(command.toString()).to.equal('Download an item');
		});
	});
});
