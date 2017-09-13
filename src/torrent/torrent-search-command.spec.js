const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const TorrentSearchCommand = require('./torrent-search-command');

describe('TorrentSearchCommand', () => {
	let command;
	let item;
	let torrentSearchService;
	let downloadCommandFactory;
	let downloadCommand;

	beforeEach(() => {
		item = {
			_id: 'item-id',
			some: 'item'
		};
		torrentSearchService = {
			search: sinon.stub().resolves({
				torrents: [
					'torrent search result'
				]
			})
		};
		downloadCommand = {};
		downloadCommandFactory = {
			create: sinon.stub().resolves(downloadCommand)
		};
		command = new TorrentSearchCommand(item, torrentSearchService, downloadCommandFactory);
	});

	describe('#execute', () => {
		it('executes a search on torrent search service', () => {
			return command.execute().then(() => {
				expect(torrentSearchService.search).to.have.been.calledWith(item);
			});
		});

		it('returns a download command as next command initialized with best torrent match', () => {
			return command.execute().then(nextCommand => {
				expect(nextCommand).to.equal(downloadCommand);
				expect(downloadCommandFactory.create).to.have.been.calledWith(item, 'torrent search result');
			});
		});
	});
});
