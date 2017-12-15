const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const TorrentSearchCommandFactory = require('./torrent-search-command-factory');
const TorrentSearchCommand = require('./torrent-search-command');

describe('TorrentSearchCommandFactory', () => {
	let factory;
	let item;
	let itemStateUpdater;
	let torrentSearchService;
	let scoringService;
	let downloadCommandFactory;

	beforeEach(() => {
		item = {
			_id: 'item-id',
			some: 'item'
		};
		itemStateUpdater = {};
		torrentSearchService = {};
		scoringService = {};
		downloadCommandFactory = {};
		factory = new TorrentSearchCommandFactory(itemStateUpdater, torrentSearchService, scoringService, downloadCommandFactory);
	});

	describe('#create', () => {
		it('creates a new command properly initialized with item and dependencies', () => {
			let command = factory.create(item);
			expect(command).to.be.an.instanceof(TorrentSearchCommand);
			expect(command.itemStateUpdater).to.equal(itemStateUpdater);
			expect(command.torrentSearchService).to.equal(torrentSearchService);
			expect(command.scoringService).to.equal(scoringService);
			expect(command.torrentSearchCommandFactory).to.equal(factory);
			expect(command.downloadCommandFactory).to.equal(downloadCommandFactory);
			expect(command.item).to.equal(item);
		});
	});
});
