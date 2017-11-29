const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const TorrentSearchCommand = require('./torrent-search-command');

describe('TorrentSearchCommand', () => {
	let command;
	let torrentSearchCommand;
	let torrentSearchCommandFactory;
	let item;
	let torrentSearchService;
	let scoringService;
	let downloadCommand;
	let downloadCommandFactory;

	beforeEach(() => {
		item = {
			_id: 'item-id',
			some: 'item',
			toString: () => 'an item'
		};
		torrentSearchService = {
			search: sinon.stub().resolves({
				torrents: [
					'torrent 1',
					'torrent 2'
				]
			})
		};
		scoringService = {
			score: sinon.stub()
		};

		scoringService.score.withArgs(item, 'torrent 1').resolves(1);
		scoringService.score.withArgs(item, 'torrent 2').resolves(1.5);

		downloadCommand = {
			command: 'download'
		};
		downloadCommandFactory = {
			create: sinon.stub().returns(downloadCommand)
		};
		torrentSearchCommand = {
			command: 'search'
		};
		torrentSearchCommandFactory = {
			create: sinon.stub().returns(torrentSearchCommand)
		};

		command = new TorrentSearchCommand(item, torrentSearchService, scoringService, torrentSearchCommandFactory, downloadCommandFactory);
	});

	describe('#execute', () => {
		it('executes a search on torrent search service', () => {
			return command.execute().then(() => {
				expect(torrentSearchService.search).to.have.been.calledWith(item);
			});
		});

		it('applies a scoring service on each result from torrent search service', () => {
			return command.execute().then(() => {
				expect(scoringService.score).to.have.been.calledWith(item, 'torrent 1');
				expect(scoringService.score).to.have.been.calledWith(item, 'torrent 2');
			});
		});

		it('returns a download command as next command initialized with highest score torrent match', () => {
			return command.execute().then(nextCommand => {
				expect(nextCommand).to.equal(downloadCommand);
				expect(downloadCommandFactory.create).to.have.been.calledWith(item, 'torrent 2');
			});
		});

		it('returns a postponed torrent search command if none of the results has been scored more than 0', () => {
			scoringService.score.withArgs(item, 'torrent 1').resolves(0);
			scoringService.score.withArgs(item, 'torrent 2').resolves(0);

			return command.execute().then(nextCommand => {
				expect(nextCommand).to.equal(torrentSearchCommand);
				expect(nextCommand.delay).to.equal(24 * 60 * 60 * 1000);
				expect(torrentSearchCommandFactory.create).to.have.been.calledWith(item);
			});
		});
	});

	describe('toString', () => {
		it('returns meaningful command info', () => {
			expect(command.toString()).to.equal('Search for a torrent for an item');
		});
	});
});