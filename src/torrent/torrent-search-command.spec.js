const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const TorrentSearchCommand = require('./torrent-search-command');

// TODO handle "state" from torrent search service

describe('TorrentSearchCommand', () => {
	let command;
	let torrentSearchCommand;
	let torrentSearchCommandFactory;
	let item;
	let torrent1;
	let torrent2;
	let torrent3;
	let torrents;
	let torrentSearchService;
	let filteringService;
	let scoringService;
	let downloadCommand;
	let downloadCommandFactory;
	let itemStateUpdater;

	beforeEach(() => {
		item = {
			_id: 'item-id',
			some: 'item',
			toString: () => 'an item'
		};
		itemStateUpdater = {
			update: sinon.stub().resolves()
		};
		torrent1 = { id : 1 };
		torrent2 = { id : 2 };
		torrent3 = { id : 3 };
		torrents = [ torrent1, torrent2, torrent3 ];
		torrentSearchService = {
			search: sinon.stub().resolves({
				torrents: torrents
			})
		};

		filteringService = {
			filter: sinon.stub().resolves([torrent1, torrent2])
		};
		scoringService = {
			score: sinon.stub()
		};

		scoringService.score.withArgs(item, [torrent1, torrent2]).resolves(torrent2);
		scoringService.score.withArgs(item, []).resolves(undefined);

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

		command = new TorrentSearchCommand(item, itemStateUpdater, torrentSearchService, filteringService, scoringService, torrentSearchCommandFactory, downloadCommandFactory);
	});

	describe('execute', () => {
		it('updates the item state to "searching"', () => {
			return command.execute().then(() => {
				expect(itemStateUpdater.update).to.have.been.calledWith(item, 'searching');
			});
		});

		it('fails when "searching" item state update fails', () => {
			const error = new Error('Some error');
			itemStateUpdater.update.rejects(error);
			return command.execute().then(() => {
				throw new Error('Execute should not have been resolved');
			}).catch(err => {
				expect(err).to.equal(error);
			});
		});

		it('executes a search on torrent search service', () => {
			return command.execute().then(() => {
				expect(torrentSearchService.search).to.have.been.calledWith(item);
			});
		});

		it('applies a filtering service on results from torrent search service', () => {
			return command.execute().then(() => {
				expect(filteringService.filter).to.have.been.calledWith(item, [torrent1, torrent2, torrent3]);
			});
		});

		it('applies a scoring service on results from filtering service', () => {
			return command.execute().then(() => {
				expect(scoringService.score).to.have.been.calledWith(item, [torrent1, torrent2]);
			});
		});

		it('returns a download command as next command initialized with the result from scoring service', () => {
			return command.execute().then(nextCommand => {
				expect(nextCommand).to.equal(downloadCommand);
				expect(downloadCommandFactory.create).to.have.been.calledWith(item, torrent2);
			});
		});

		it('updates the item state to "error" if the command fails unexpectedly and rethrows the error', () => {
			const error = new Error('Some error');
			torrentSearchService.search.rejects(error);
			return command.execute().then(() => {
				throw new Error('Expected not to resolve');
			}).catch(e => {
				expect(e).to.equal(error);
				expect(itemStateUpdater.update).to.have.been.calledWith(item, 'error');
			});
		});

		it('updates the item state to "found" when a torrent has been found which has not been filtered out', () => {
			return command.execute().then(() => {
				expect(itemStateUpdater.update).to.have.been.calledWith(item, 'found');
			});
		});

		it('fails when "found" item state update fails', () => {
			const error = new Error('Some error');
			itemStateUpdater.update.withArgs(item, 'found').rejects(error);
			return command.execute().then(() => {
				throw new Error('Execute should not have been resolved');
			}).catch(err => {
				expect(err).to.equal(error);
			});
		});

		it('returns a postponed torrent search command if all results have been filtered out', () => {
			filteringService.filter.resolves([]);

			return command.execute().then(nextCommand => {
				expect(nextCommand).to.equal(torrentSearchCommand);
				expect(nextCommand.delay).to.equal(24 * 60 * 60 * 1000);
				expect(torrentSearchCommandFactory.create).to.have.been.calledWith(item);
			});
		});

		it('updates the item state to "not-found" when no torrent has been found with score higher than 0', () => {
			filteringService.filter.resolves([]);

			return command.execute().then(() => {
				expect(itemStateUpdater.update).to.have.been.calledWith(item, 'not-found');
			});
		});

		it('fails when "not-found" item state update fails', () => {
			filteringService.filter.resolves([]);

			const error = new Error('Some error');
			itemStateUpdater.update.withArgs(item, 'not-found').rejects(error);
			return command.execute().then(() => {
				throw new Error('Execute should not have been resolved');
			}).catch(err => {
				expect(err).to.equal(error);
			});
		});
	});

	describe('toString', () => {
		it('returns meaningful command info', () => {
			expect(command.toString()).to.equal('Search for a torrent for an item');
		});
	});
});
