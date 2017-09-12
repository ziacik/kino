const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const TorrentSearchCommandFactory = require('./torrent-search-command-factory');
const TorrentSearchCommand = require('./torrent-search-command');

describe('TorrentSearchCommandFactory', () => {
	let factory;
	let item;
	let torrentSearchService;

	beforeEach(() => {
		item = {
			_id: 'item-id',
			some: 'item'
		};
		torrentSearchService = {};
		factory = new TorrentSearchCommandFactory(torrentSearchService);
	});

	describe('#create', () => {
		it('creates a new command properly initialized with item and dependencies', () => {
			let command = factory.create(item);
			expect(command).to.be.an.instanceof(TorrentSearchCommand);
			expect(command.torrentSearchService).to.equal(torrentSearchService);
			expect(command.item).to.equal(item);
		});
	});
});
