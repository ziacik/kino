const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const TorrentSearchCommand = require('./torrent-search-command');

describe('TorrentSearchCommand', () => {
	let command;
	let item;
	let torrentSearchService;

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
		command = new TorrentSearchCommand(item, torrentSearchService);
	});

	describe('#execute', () => {
		it('executes a search on torrent search service', () => {
			command.item = item;
			return command.execute().then(() => {
				expect(torrentSearchService.search).to.have.been.calledWith(item);
			});
		});
	});
});
