const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

const test = require('../../test');
const TpbEngine = require('./tpb-engine');
const Torrent = require('../torrent');

describe('TpbEngine', () => {
	let engine;
	let lib;
	let item;
	let logger;
	let result;

	beforeEach(() => {
		logger = {
			info: sinon.stub(),
			error: sinon.stub()
		};
		item = {
			name: 'item-name'
		};
		result = {
			id: 'torrent-id',
			name: 'Torrent Name',
			size: '550 MiB',
			link: 'torrent-page-link',
			category: {
				id: '200',
				name: 'Video'
			},
			seeders: '10',
			leechers: '20',
			magnetLink: 'magnet:some',
			subcategory: {
				id: '205',
				name: 'TV shows'
			},
			uploader: 'eztv',
			verified: true
		};
		lib = {
			search: sinon.stub().resolves([result])
		};
		engine = new TpbEngine(logger, lib);
	});

	it('rejects and logs an error on lib error', () => {
		lib.search.rejects(test.error);
		return engine.search(item).then(() => {
			throw new Error('Should not resolve.');
		}).catch(e => {
			expect(e).to.equal(test.error);
			expect(logger.error).to.have.been.calledWith(engine, 'Search for torrents for', item, 'failed with', test.error);
		});
	});

	it('converts results to Torrent instances', () => {
		return engine.search(item).then(torrents => {
			let torrent = torrents[0];
			expect(torrent).to.be.an.instanceof(Torrent);
			expect(torrent.magnetLink).to.equal('magnet:some');
			expect(torrent.id).to.equal('torrent-id');
			expect(torrent.name).to.equal('Torrent Name');
			expect(torrent.size).to.equal(550);
			expect(torrent.pageLink).to.equal('torrent-page-link');
			expect(torrent.type).to.equal('show');
			expect(torrent.quality).to.equal('sd');
			expect(torrent.seeders).to.equal(10);
			expect(torrent.leechers).to.equal(20);
			expect(torrent.verified).to.be.true;
		});
	});

	it('logs info about the number of torrents found', () => {
		return engine.search(item).then(torrents => {
			expect(logger.info).to.have.been.calledWith(engine, torrents.length, 'torrents found for', item);
		});
	});

	describe('for movie item', () => {
		beforeEach(() => {
			item.type = 'movie';
		});

		it('does a movie search', () => {
			return engine.search(item).then(() => {
				expect(lib.search).to.have.been.calledWith('item-name');
			});
		});
	});

	describe('toString', () => {
		it('returns meaningful info', () => {
			expect(engine.toString()).to.equal('ThePirateBay');
		});
	});
});
