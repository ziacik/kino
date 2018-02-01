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
			name: 'item-name',
			type: 'movie'
		};
		result = {
			title: 'Torrent Name',
			time: '05-02 2014',
			seeds: 10,
			peers: 20,
			size: '550 MiB',
			magnet: 'magnet:some',
			desc: 'http://thepiratebay/torrent/torrent-id/whatever',
			provider: 'ThePirateBay',
			subcategory: 'Movies'
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
			expect(torrent.pageLink).to.equal('http://thepiratebay/torrent/torrent-id/whatever');
			expect(torrent.type).to.equal('movie');
			expect(torrent.quality).to.equal('sd');
			expect(torrent.seeders).to.equal(10);
			expect(torrent.leechers).to.equal(20);
			// TODO
			// expect(torrent.verified).to.be.true;
		});
	});

	it('logs info about the number of torrents found', () => {
		return engine.search(item).then(torrents => {
			expect(logger.info).to.have.been.calledWith(engine, torrents.length, 'torrents found for', item);
		});
	});

	describe('for a movie item', () => {
		beforeEach(() => {
			item.type = 'movie';
			result.subcategory = 'Movies';
		});

		it('does a movie search', () => {
			return engine.search(item).then(() => {
				expect(lib.search).to.have.been.calledWith('item-name', 'Video');
			});
		});

		it('ignores results with subcategory other than Movies, Movies DVDR, HD - Movies', () => {
			result.subcategory = 'Something';
			return engine.search(item).then(torrents => expect(torrents.length).to.equal(0));
		});

		it('accepts results with subcategory Movies', () => {
			result.subcategory = 'Movies';
			return engine.search(item).then(torrents => expect(torrents.length).to.equal(1));
		});

		it('accepts results with subcategory Movies DVDR', () => {
			result.subcategory = 'Movies DVDR';
			return engine.search(item).then(torrents => expect(torrents.length).to.equal(1));
		});

		it('accepts results with subcategory HD - Movies', () => {
			result.subcategory = 'HD - Movies';
			return engine.search(item).then(torrents => expect(torrents.length).to.equal(1));
		});

		it('ensures the torrent type is movie', () => {
			return engine.search(item).then(torrents => {
				expect(torrents[0].type).to.equal('movie');
			});
		});

		it('sets quality to SD by default', () => {
			return engine.search(item).then(torrents => {
				expect(torrents[0].quality).to.equal('sd');
			});
		});

		it('sets quality to HD when subcategory is HD - Movies', () => {
			result.subcategory = 'HD - Movies';
			return engine.search(item).then(torrents => {
				expect(torrents[0].quality).to.equal('hd');
			});
		});

		it('sets quality to HD when title contains 1080p', () => {
			result.title += ' 1080p';
			return engine.search(item).then(torrents => {
				expect(torrents[0].quality).to.equal('hd');
			});
		});

		it('sets quality to HD when title contains 720p', () => {
			result.title += ' 720p';
			return engine.search(item).then(torrents => {
				expect(torrents[0].quality).to.equal('hd');
			});
		});
	});

	describe('for a show season item', () => {
		beforeEach(() => {
			result.subcategory = 'TV shows';
			item.type = 'season';
			item.no = 2;
			delete item.name;
			item.parent = {
				name: 'show-name'
			};
		});

		it('does a show search', () => {
			return engine.search(item).then(() => {
				expect(lib.search).to.have.been.calledWith('show-name season 2', 'Video');
			});
		});

		it('ensures the torrent type is season', () => {
			return engine.search(item).then(torrents => {
				expect(torrents[0].type).to.equal('season');
			});
		});

		it('ignores results with subcategory other than TV shows, HD - TV shows', () => {
			result.subcategory = 'Something';
			return engine.search(item).then(torrents => expect(torrents.length).to.equal(0));
		});

		it('accepts results with subcategory TV shows', () => {
			result.subcategory = 'TV shows';
			return engine.search(item).then(torrents => expect(torrents.length).to.equal(1));
		});

		it('accepts results with subcategory HD - TV shows', () => {
			result.subcategory = 'HD - TV shows';
			return engine.search(item).then(torrents => expect(torrents.length).to.equal(1));
		});

		it('sets quality to SD by default', () => {
			return engine.search(item).then(torrents => {
				expect(torrents[0].quality).to.equal('sd');
			});
		});

		it('sets quality to HD when subcategory is HD - TV shows', () => {
			result.subcategory = 'HD - TV shows';
			return engine.search(item).then(torrents => {
				expect(torrents[0].quality).to.equal('hd');
			});
		});

		it('sets quality to HD when title contains 1080p', () => {
			result.title += ' 1080p';
			return engine.search(item).then(torrents => {
				expect(torrents[0].quality).to.equal('hd');
			});
		});

		it('sets quality to HD when title contains 720p', () => {
			result.title += ' 720p';
			return engine.search(item).then(torrents => {
				expect(torrents[0].quality).to.equal('hd');
			});
		});
	});

	describe('for a music album item', () => {
		beforeEach(() => {
			result.subcategory = 'Music';
			item.type = 'album';
			item.name = 'album-name';
			item.parent = {
				name: 'some-artist'
			};
		});

		it('does an album search', () => {
			return engine.search(item).then(() => {
				expect(lib.search).to.have.been.calledWith('some-artist album-name', 'Audio');
			});
		});

		it('ensures the torrent type is album', () => {
			return engine.search(item).then(torrents => {
				expect(torrents[0].type).to.equal('album');
			});
		});

		it('ignores results with subcategory other than Music, FLAC', () => {
			result.subcategory = 'Something';
			return engine.search(item).then(torrents => expect(torrents.length).to.equal(0));
		});

		it('accepts results with subcategory Music', () => {
			result.subcategory = 'Music';
			return engine.search(item).then(torrents => expect(torrents.length).to.equal(1));
		});

		it('accepts results with subcategory FLAC', () => {
			result.subcategory = 'FLAC';
			return engine.search(item).then(torrents => expect(torrents.length).to.equal(1));
		});

		it('sets quality to SD by default', () => {
			return engine.search(item).then(torrents => {
				expect(torrents[0].quality).to.equal('sd');
			});
		});

		it('sets quality to HD when subcategory is FLAC', () => {
			result.subcategory = 'FLAC';
			return engine.search(item).then(torrents => {
				expect(torrents[0].quality).to.equal('hd');
			});
		});

		it('sets quality to HD when title contains FLAC', () => {
			result.title += ' FLAC';
			return engine.search(item).then(torrents => {
				expect(torrents[0].quality).to.equal('hd');
			});
		});
	});

	describe('toString', () => {
		it('returns meaningful info', () => {
			expect(engine.toString()).to.equal('TPB Engine');
		});
	});
});
