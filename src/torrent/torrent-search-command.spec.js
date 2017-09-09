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
			search: sinon.stub().resolves('torrent search result')
		};
		command = new TorrentSearchCommand(torrentSearchService);
	});

	describe('#create', () => {
		it('creates a new command with the same data', () => {
			let another = command.create(item);
			expect(another).not.to.equal(command);
			expect(another.torrentSearchService).to.equal(torrentSearchService);
			expect(another.item).to.equal(item);
		});
	});

	describe('#execute', () => {
		it('executes a search on torrent search service and returns the result from it', () => {
			command.item = item;
			return command.execute().then(result => {
				expect(torrentSearchService.search).to.have.been.calledWith(item);
				expect(result).to.equal('torrent search result');
			});
		});
	});
});
